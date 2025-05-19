import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({ host: "localhost", user: "root", password: "root", database: "movie_booking" });

export async function PUT(request) {
  const { showId, start_time, end_time, price } = await request.json();
  if (!showId || !start_time || !end_time || price === undefined)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  try {
    const connection = await pool.getConnection();
    await connection.query(
      "UPDATE Shows SET start_time = ?, end_time = ?, price = ? WHERE show_id = ?",
      [start_time, end_time, price, showId]
    );
    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
