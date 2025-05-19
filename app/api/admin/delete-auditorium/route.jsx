import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({ host: "localhost", user: "root", password: "root", database: "movie_booking" });

export async function DELETE(request) {
  const { auditoriumId } = await request.json();
  if (!auditoriumId) return NextResponse.json({ error: "Missing auditoriumId" }, { status: 400 });

  try {
    const connection = await pool.getConnection();
    await connection.query("DELETE FROM Auditoriums WHERE auditorium_id = ?", [auditoriumId]);
    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting auditorium:", error); // <-- This will print the error in your server console
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
