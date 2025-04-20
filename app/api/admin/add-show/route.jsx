import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
});

export async function POST(request) {
  try {
    const { movieId, auditoriumId, startTime, endTime, price } = await request.json();

    const connection = await pool.getConnection();
    await connection.execute(
      "INSERT INTO Shows (movie_id, auditorium_id, start_time, end_time, price) VALUES (?, ?, ?, ?, ?)",
      [movieId, auditoriumId, startTime, endTime, price]
    );
    connection.release();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Add show error:", error);
    return NextResponse.json({ error: "Failed to add show" }, { status: 500 });
  }
}
