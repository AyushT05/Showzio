import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { selectedSeats, showId, totalPrice, userId } = await request.json();

    // Validate input
    if (!selectedSeats?.length || !showId || !totalPrice || !userId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Movie Tickets",
              description: `${selectedSeats.length} seat(s) for show ${showId}`,
            },
            unit_amount: Math.round(totalPrice * 100), // Convert to paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        showId,
        userId,
        seatIds: JSON.stringify(selectedSeats),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/${showId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
