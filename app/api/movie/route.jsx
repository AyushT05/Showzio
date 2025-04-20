import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "movie_booking",
  waitForConnections: true,
  connectionLimit: 10,
});

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM Movies");
    connection.release();

    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("Error fetching movies:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
