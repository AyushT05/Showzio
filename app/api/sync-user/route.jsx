// app/api/sync-user/route.js
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Use connection pool for better performance
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function POST(req) {
  const body = await req.json();
  const { clerkUserId, name, email } = body;

  // Input validation
  if (!clerkUserId || !email) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const connection = await pool.getConnection();

    // Check existing user using user_id (Clerk's ID)
    const [existing] = await connection.execute(
      "SELECT * FROM Users WHERE user_id = ?",
      [clerkUserId]
    );

    if (existing.length > 0) {
      // Update existing user
      await connection.execute(
        "UPDATE Users SET full_name = ?, email = ? WHERE user_id = ?",
        [name, email, clerkUserId]
      );
    } else {
      // Insert new user
      await connection.execute(
        "INSERT INTO Users (user_id, full_name, email) VALUES (?, ?, ?)",
        [clerkUserId, name, email]
      );
    }

    connection.release(); // Release connection back to pool

    return NextResponse.json(
      { success: true, action: existing.length ? "updated" : "created" },
      { status: 200 }
    );
  } catch (err) {
    console.error("User sync error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
