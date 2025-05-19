import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
});

export async function POST(request, { params }) {
  const { userid, showId, sessionId } = await params;

  if (!userid || !showId || !sessionId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();

    // Update all bookings for this user and show that don't have a session ID yet
    await connection.query(
      `UPDATE Bookings
       SET stripe_session_id = ?
       WHERE user_id = ? AND show_id = ? AND stripe_session_id IS NULL`,
      [sessionId, userid, showId]
    );

    connection.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
