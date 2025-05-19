import { NextResponse } from "next/server";
import Stripe from "stripe";
import mysql from "mysql2/promise";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
});

export async function POST(request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      // Extract metadata
      const { showId, userId, seatIds } = session.metadata;
      const seats = JSON.parse(seatIds);

      // Check for existing bookings
      const [existing] = await connection.query(
        `SELECT seat_id FROM Bookings 
         WHERE show_id = ? AND seat_id IN (?) 
         AND status = 'Reserved'`,
        [showId, seats]
      );

      if (existing.length > 0) {
        await connection.rollback();
        console.error("Seats already booked:", existing);
        return NextResponse.json({ error: "Seats already booked" }, { status: 409 });
      }

      // Create bookings
      for (const seatId of seats) {
        await connection.query(
          `INSERT INTO Bookings 
           (user_id, show_id, seat_id, status) 
           VALUES (?, ?, ?, 'Reserved')`,
          [userId, showId, seatId]
        );
      }

      await connection.commit();
      connection.release();
      
      console.log("Bookings created successfully for session:", session.id);
    } catch (error) {
      console.error("Database operation failed:", error);
      return NextResponse.json({ error: "Booking creation failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
