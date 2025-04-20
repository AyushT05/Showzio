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
  const { movieId } = params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM Movies WHERE movie_id = ?",
      [movieId]
    );
    connection.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    console.error("Error fetching movie details:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
