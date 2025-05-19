import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({ host: "localhost", user: "root", password: "root", database: "movie_booking" });

export async function DELETE(request) {
  const { movieId } = await request.json();
  if (!movieId) return NextResponse.json({ error: "Missing movieId" }, { status: 400 });

  try {
    const connection = await pool.getConnection();
    await connection.query("DELETE FROM Movies WHERE movie_id = ?", [movieId]);
    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete movie error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
