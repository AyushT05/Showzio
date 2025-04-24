"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";

export default function SeatSelectionPage() {
  const { movieId, showId } = useParams();
  const { user } = useUser();
  const router = useRouter();

  const [showDetails, setShowDetails] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const showRes = await fetch(`/api/shows/${showId}`);
        if (!showRes.ok) throw new Error("Failed to fetch show details");
        const showData = await showRes.json();
        setShowDetails(showData);

        const seatsRes = await fetch(`/api/shows/${showId}/seats`);
        if (!seatsRes.ok) throw new Error("Failed to fetch seats");
        const seatsData = await seatsRes.json();
        setSeats(seatsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [showId]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(seatId)) newSet.delete(seatId);
      else newSet.add(seatId);
      return newSet;
    });
  };

  const totalPrice = [...selectedSeats].reduce((total, seatId) => {
    const seat = seats.find((s) => s.seat_id === seatId);
    if (!seat) return total;

    let multiplier = 1;
    if (seat.seat_type === "Premium") multiplier = 1.5;
    else if (seat.seat_type === "VIP") multiplier = 2;

    return total + Number(showDetails.price) * multiplier;
  }, 0);

  const handleBooking = async () => {
    if (selectedSeats.size === 0) {
      alert("Please select at least one seat.");
      return;
    }

    try {
      const userId = user?.id;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          showId,
          seatIds: Array.from(selectedSeats),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Booking failed");
      }

      alert("Booking successful!");
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow max-w-5xl mx-auto p-6 sm:p-10">
          <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col h-full">
            <h1 className="text-xl font-bold mb-2 text-left text-black">
              Please Select Your Seats
            </h1>
            <p className="text-left text-gray-600 mb-6">
            {showDetails.movie_title} | {showDetails.theater_name} | Screen {showDetails.auditorium_name} <br />
              <span className="text-sm">
                Start: {new Date(showDetails.start_time).toLocaleString()}
              </span>
            </p>

            {/* Seat Legend */}
            <div className="flex justify-center gap-6 mb-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 border rounded" /> Regular
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 border-2 border-blue-500 rounded" /> Premium
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 border-2 border-yellow-500 rounded" /> VIP
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-400 rounded" /> Booked
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded" /> Selected
              </div>
            </div>

            {/* Seat Grid */}
            <div className="grid grid-cols-10 gap-2 justify-center mb-6">
              {seats.map((seat) => (
                <button
                  key={seat.seat_id}
                  disabled={seat.isBooked}
                  onClick={() => toggleSeat(seat.seat_id)}
                  className={`
                w-10 h-10 flex items-center justify-center rounded font-bold text-xs transition duration-200
                ${seat.isBooked ? "bg-gray-400 cursor-not-allowed text-white" :
                      selectedSeats.has(seat.seat_id)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
                ${seat.seat_type === "VIP" ? "border-2 border-yellow-500" : ""}
                ${seat.seat_type === "Premium" ? "border-2 border-blue-500" : ""}
                ${seat.seat_type === "Regular" ? "border-red" : ""}
              `}
                  title={`Row ${seat.row_num}, Seat ${seat.seat_number} (${seat.seat_type})`}
                >
                  {seat.row_num}{seat.seat_number}
                </button>
              ))}
            </div>
            {/* Theater Screen */}
            <div className="flex flex-col items-center mb-8 mt-10">
              <div className="rotate-180 w-full">
                <div className="h-10 bg-gray-300 rounded-b-[100%] shadow-md relative overflow-hidden w-full" />
              </div>
              <div className="mt-2 text-sm font-semibold text-gray-600 tracking-wide">
                ━━ All Eyes on Me! ━━
              </div>
            </div>





            {/* Price Summary */}
            <div className="mt-auto">
              <div className="bg-gray-100 rounded-xl p-5 mb-6 mt-10 shadow-inner w-full max-w-md mx-auto text-left">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Summary</h2>

                <div className="flex justify-between items-center text-base text-gray-700 mb-2">
                  <span>Seats Selected</span>
                  <span className="text-[#FF847C] font-medium">{selectedSeats.size}</span>
                </div>

                <div className="flex justify-between items-center text-base text-gray-700">
                  <span>Total Price</span>
                  <span className="font-semibold text-black">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleBooking}
                  disabled={selectedSeats.size === 0}
                  className="bg-[#FF847C] hover:bg-[#e66c67] transition-all duration-200 px-8 py-2.5 rounded-md text-white text-base font-medium disabled:opacity-50 shadow-md"
                >
                  Confirm Booking
                </button>
              </div>
            </div>


          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}