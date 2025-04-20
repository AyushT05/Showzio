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
    const { theaterId, name, totalSeats } = await request.json();

    const connection = await pool.getConnection();
    await connection.execute(
      "INSERT INTO Auditoriums (theater_id, name, total_seats) VALUES (?, ?, ?)",
      [theaterId, name, totalSeats]
    );
    connection.release();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Add auditorium error:", error);
    return NextResponse.json({ error: "Failed to add auditorium" }, { status: 500 });
  }
}
