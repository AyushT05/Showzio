import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({ host: "localhost", user: "root", password: "root", database: "movie_booking" });

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  if (!query) return NextResponse.json([]);

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT movie_id, title, genre, language, poster FROM Movies WHERE title LIKE ?",
      [`%${query}%`]
    );
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
