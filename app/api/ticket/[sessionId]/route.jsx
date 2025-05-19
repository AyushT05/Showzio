import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
});

export async function GET(request, { params }) {
  const { sessionId } = await params;
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();

    // Get all bookings for this session
    const [rows] = await connection.query(
      `SELECT 
         b.booking_id, b.user_id, u.full_name, u.email,
         m.title AS movie_title, m.poster,
         t.name AS theater_name, t.city,
         a.name AS auditorium_name,
         s.start_time, s.end_time, s.price,
         seat.row_num, seat.seat_number, seat.seat_type,
         b.stripe_session_id
       FROM Bookings b
       JOIN Users u ON b.user_id = u.user_id
       JOIN Shows s ON b.show_id = s.show_id
       JOIN Movies m ON s.movie_id = m.movie_id
       JOIN Auditoriums a ON s.auditorium_id = a.auditorium_id
       JOIN Theaters t ON a.theater_id = t.theater_id
       JOIN Seats seat ON b.seat_id = seat.seat_id
       WHERE b.stripe_session_id = ?`,
      [sessionId]
    );
    connection.release();

    if (!rows.length) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Aggregate seat info and calculate total price
    const user = {
      name: rows[0].full_name,
      email: rows[0].email,
    };
    const movie = {
      title: rows[0].movie_title,
      poster: rows[0].poster,
    };
    const theater = {
      name: rows[0].theater_name,
      city: rows[0].city,
    };
    const auditorium = {
      name: rows[0].auditorium_name,
    };
    const show = {
      start_time: rows[0].start_time,
      end_time: rows[0].end_time,
      price: rows[0].price,
    };
    const seats = rows.map(seat => ({
      row: seat.row_num,
      number: seat.seat_number,
      type: seat.seat_type,
    }));

    let total_price = 0;
    seats.forEach(seat => {
      let multiplier = 1;
      if (seat.type === "Premium") multiplier = 1.5;
      if (seat.type === "VIP") multiplier = 2;
      total_price += Number(show.price) * multiplier;
    });

    return NextResponse.json({
      user,
      movie,
      theater,
      auditorium,
      show,
      seats,
      total_price,
      seat_count: seats.length,
      sessionId,
    });
  } catch (error) {
    console.error("Fetch ticket error:", error);
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 });
  }
}
