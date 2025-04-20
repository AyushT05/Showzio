import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
});

export async function POST(request) {
  const body = await request.json();
  const { name, city, totalAuditoriums } = body;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      "INSERT INTO Theaters (name, city, total_auditoriums) VALUES (?, ?, ?)",
      [name, city, totalAuditoriums]
    );
    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add theater error:", error);
    return NextResponse.json({ error: "Failed to add theater" }, { status: 500 });
  }
}
