import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({ host: "localhost", user: "root", password: "root", database: "movie_booking" });

export async function DELETE(request) {
  const { showId } = await request.json();
  if (!showId) return NextResponse.json({ error: "Missing showId" }, { status: 400 });

  try {
    const connection = await pool.getConnection();
    await connection.query("DELETE FROM Shows WHERE show_id = ?", [showId]);
    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
