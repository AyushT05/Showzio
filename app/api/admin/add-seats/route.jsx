import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
});

export async function POST(request) {
  try {
    const { auditoriumId, rowNum, seats, seatType } = await request.json();

    const connection = await pool.getConnection();

    const values = seats.map((seatNumber) => [auditoriumId, rowNum, seatNumber, seatType]);

    await connection.query(
      "INSERT INTO Seats (auditorium_id, row_num, seat_number, seat_type) VALUES ?",
      [values]
    );

    connection.release();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Add seats error:", error);
    return NextResponse.json({ error: "Failed to add seats" }, { status: 500 });
  }
}
