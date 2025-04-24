import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
});

export async function GET(request, { params }) {
  const { showId } = params;

  try {
    const connection = await pool.getConnection();

    // Get auditorium_id for the show
    const [showRows] = await connection.execute(
      "SELECT auditorium_id FROM Shows WHERE show_id = ?",
      [showId]
    );

    if (showRows.length === 0) {
      connection.release();
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    const auditoriumId = showRows[0].auditorium_id;

    // Get all seats for the auditorium
    const [seats] = await connection.execute(
      `SELECT seat_id, row_num, seat_number, seat_type
       FROM Seats
       WHERE auditorium_id = ?
       ORDER BY row_num, seat_number`,
      [auditoriumId]
    );

    // Get booked seats for this show
    const [bookedSeats] = await connection.execute(
      `SELECT seat_id FROM Bookings WHERE show_id = ? AND status = 'Reserved'`,
      [showId]
    );

    connection.release();

    const bookedSeatIds = new Set(bookedSeats.map((b) => b.seat_id));

    // Mark seats as booked or available
    const seatsWithStatus = seats.map((seat) => ({
      ...seat,
      isBooked: bookedSeatIds.has(seat.seat_id),
    }));

    return NextResponse.json(seatsWithStatus);
  } catch (error) {
    console.error("Error fetching seats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
