import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({ host: "localhost", user: "root", password: "root", database: "movie_booking" });

export async function DELETE(request) {
  const { seatId } = await request.json();
  if (!seatId) return NextResponse.json({ error: "Missing seatId" }, { status: 400 });

  try {
    const connection = await pool.getConnection();
    await connection.query("DELETE FROM Seats WHERE seat_id = ?", [seatId]);
    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
