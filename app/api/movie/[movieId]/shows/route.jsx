import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
});

export async function GET(request, { params }) {
  const { movieId } = params;

  try {
    const connection = await pool.getConnection();

    // Fetch movie details
    const [movieRows] = await connection.execute(
      "SELECT * FROM Movies WHERE movie_id = ?",
      [movieId]
    );

    if (movieRows.length === 0) {
      connection.release();
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    const movie = movieRows[0];

    // Fetch shows with auditorium and theater info
    const [showRows] = await connection.execute(
      `SELECT 
          s.show_id, s.start_time, s.end_time, s.price,
          a.auditorium_id, a.name as auditorium_name,
          t.theater_id, t.name as theater_name, t.city
       FROM Shows s
       JOIN Auditoriums a ON s.auditorium_id = a.auditorium_id
       JOIN Theaters t ON a.theater_id = t.theater_id
       WHERE s.movie_id = ?
       ORDER BY s.start_time`,
      [movieId]
    );

    connection.release();

    return NextResponse.json({ movie, shows: showRows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching movie shows:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
