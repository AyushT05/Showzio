import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({ host: "localhost", user: "root", password: "root", database: "movie_booking" });

export async function DELETE(request) {
  const { theaterId } = await request.json();
  if (!theaterId) return NextResponse.json({ error: "Missing theaterId" }, { status: 400 });

  try {
    const connection = await pool.getConnection();
    await connection.query("DELETE FROM Theaters WHERE theater_id = ?", [theaterId]);
    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
