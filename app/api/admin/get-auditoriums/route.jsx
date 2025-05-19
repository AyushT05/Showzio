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
    const [rows] = await connection.execute(
      `SELECT
        a.auditorium_id,
        a.name AS auditorium_name,
        a.theater_id,
        t.name AS theater_name,
        t.city AS theater_city,
        a.total_seats
      FROM Auditoriums a
      JOIN Theaters t ON a.theater_id = t.theater_id
      ORDER BY a.theater_id`
    );
    connection.release();

    console.log("Auditoriums with theaters:", rows);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Get auditoriums error:", error);
    return NextResponse.json({ error: "Failed to fetch auditoriums" }, { status: 500 });
  }
}
