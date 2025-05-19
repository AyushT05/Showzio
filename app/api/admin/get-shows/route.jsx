import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({ host: "localhost", user: "root", password: "root", database: "movie_booking" });

export async function GET() {
  try {
    const connection = await pool.getConnection();
    // Join with movies, auditoriums, and theaters to get all relevant info
    const [rows] = await connection.query(`
      SELECT 
        s.show_id,
        s.start_time,
        s.end_time,
        s.price,
        m.title AS movie_title,
        a.name AS auditorium_name,
        t.name AS theater_name
      FROM Shows s
      JOIN Movies m ON s.movie_id = m.movie_id
      JOIN Auditoriums a ON s.auditorium_id = a.auditorium_id
      JOIN Theaters t ON a.theater_id = t.theater_id
      ORDER BY s.start_time DESC
    `);
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
