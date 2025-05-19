"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";

export default function AddSeats() {
  const [auditoriums, setAuditoriums] = useState([]);
  const [auditoriumId, setAuditoriumId] = useState("");
  const [rowNum, setRowNum] = useState("");
  const [seatNumbers, setSeatNumbers] = useState("");
  const [seatType, setSeatType] = useState("Normal");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/get-auditoriums")
      .then((res) => res.json())
      .then((data) => {
        setAuditoriums(data);
        if (data.length > 0) setAuditoriumId(data[0].auditorium_id);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const seats = seatNumbers
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    try {
      const res = await fetch("/api/admin/add-seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditoriumId, rowNum, seats, seatType }),
      });

      if (res.ok) {
        toast.success("🎉 Seats added successfully!");
        router.push("/admin/seats");
      } else {
        toast.error("❌ Failed to add seats. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add Seats to Screen
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Select Screen</label>
              <select
                value={auditoriumId}
                onChange={(e) => setAuditoriumId(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
              >
                {auditoriums.map((aud) => (
                  <option key={aud.auditorium_id} value={aud.auditorium_id}>
                    {aud.auditorium_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Row Letter</label>
              <input
                type="text"
                value={rowNum}
                onChange={(e) => setRowNum(e.target.value.toUpperCase())}
                maxLength={2}
                required
                placeholder="e.g. A"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Seat Numbers</label>
              <input
                type="text"
                placeholder="e.g. 1,2,3"
                value={seatNumbers}
                onChange={(e) => setSeatNumbers(e.target.value)}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Seat Type</label>
              <select
                value={seatType}
                onChange={(e) => setSeatType(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
              >
                <option value="Normal">Normal</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <button
                type="submit"
                className="bg-[#FF847C] hover:bg-[#ff6a62] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md"
              >
                + Add Seats
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/dashboard")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-md"
              >
                Back to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
