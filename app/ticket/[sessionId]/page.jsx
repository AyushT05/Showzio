"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toPng } from "html-to-image";

export default function TicketPage() {
  const ticketRef = useRef(null);
  const { sessionId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    async function fetchTicket() {
      setLoading(true);
      const res = await fetch(`/api/ticket/${sessionId}`);
      const data = await res.json();
      setTicket(data);
      setLoading(false);
    }
    fetchTicket();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffe5e0] to-[#ffece8]">
        <Loader2 className="animate-spin w-8 h-8 text-[#FF847C]" />
        <span className="ml-2 text-lg font-semibold text-[#FF847C]">Loading your ticket...</span>
      </div>
    );
  }

  if (!ticket || ticket.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-red-500 font-semibold">Ticket not found.</div>
      </div>
    );
  }

  const { user, movie, theater, auditorium, show, seats, total_price, seat_count, sessionId: sid } = ticket;

  const downloadTicket = async () => {
    if (ticketRef.current === null) return;
    await document.fonts.ready;
    const dataUrl = await toPng(ticketRef.current,{ skipFonts: true });
    const link = document.createElement("a");
    link.download = `SHOWZIO-${sid}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff5f3] to-[#ffe5e0] px-4 py-10">
      <div className="relative">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-[#FF847C]/30 p-6 relative overflow-hidden"
          ref={ticketRef}
        >
          <h1 className="text-2xl font-bold text-center text-black mb-6">Your Movie Ticket</h1>

          <div className="flex flex-col items-center mb-4">
            {movie.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-90 h-45 object-cover rounded-lg shadow mb-3"
              />
            )}
            <div className="text-xl font-bold text-gray-800">{movie.title}</div>
            <div className="text-gray-600 text-sm">{theater.name}, {theater.city}</div>
            <div className="text-gray-500 text-sm">Screen: {auditorium.name}</div>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Show Time: </span>
              {new Date(show.start_time).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Booked By: </span>
              {user.name} ({user.email})
            </div>
            <div>
              <span className="font-semibold">Seats: </span>
              {seats.map(seat => `${seat.row}${seat.number} (${seat.type})`).join(", ")}
            </div>
            <div>
              <span className="font-semibold">Total Seats: </span>
              {seat_count}
            </div>
            <div>
              <span className="font-semibold">Total Price: </span>
              ₹{total_price.toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Session ID: </span>
              <span className="text-xs text-gray-400 break-all">{sid}</span>
            </div>
          </div>

          <div className="mt-8 border-t pt-4 flex items-center justify-between text-sm text-gray-500">
            <span className="font-medium">
              <img src="/showzio.png" alt="Secure" className="h-9" />
            </span>
            <img src="/stripe-secure.png" alt="Stripe" className="h-6" />
          </div>
        </div>
      </div>
      {/* Move the button here, outside the white div */}
      <button
        onClick={downloadTicket}
        className="absolute top-6 right-6 bg-[#FF847C] hover:bg-[#ff6d61] text-white px-4 py-2 rounded-lg shadow transition"
      >
        Download Ticket
      </button>
    </div>
  );
}
