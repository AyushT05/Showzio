import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(req, { params }) {
  const { showId } = params;

  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT 
         s.show_id, s.start_time, s.end_time, s.price,
         m.movie_id, m.title AS movie_title,
         a.auditorium_id, a.name AS auditorium_name,
         t.theater_id, t.name AS theater_name, t.city
       FROM Shows s
       JOIN Movies m ON s.movie_id = m.movie_id
       JOIN Auditoriums a ON s.auditorium_id = a.auditorium_id
       JOIN Theaters t ON a.theater_id = t.theater_id
       WHERE s.show_id = ?`,
      [showId]
    );

    connection.release();

    if (rows.length === 0) {
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching show details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
