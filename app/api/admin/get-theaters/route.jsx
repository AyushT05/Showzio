import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
});

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT theater_id, name, city FROM Theaters");
    connection.release();

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Get theaters error:", error);
    return NextResponse.json({ error: "Failed to fetch theaters" }, { status: 500 });
  }
}
