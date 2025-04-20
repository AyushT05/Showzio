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

export async function POST(req) {
  const body = await req.json();
  const { title, genre, durationMin, releaseDate, language, poster, trailerUrl } = body;

  try {
    const connection = await pool.getConnection();

    await connection.execute(
      "INSERT INTO Movies (title, genre, duration_min, release_date, language, poster, trailer_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, genre, durationMin, releaseDate, language, poster, trailerUrl]
    );

    connection.release();

    return NextResponse.json({ success: true, message: "Movie added successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error adding movie:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
