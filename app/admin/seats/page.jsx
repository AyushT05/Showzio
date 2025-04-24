"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

      if (!res.ok) throw new Error("Failed to add seats");
      router.push("/admin/seats");
    } catch (err) {
      console.error(err);
      alert("Error adding seats");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add Seats to Screen
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Screen
              </label>
              <select
                value={auditoriumId}
                onChange={(e) => setAuditoriumId(e.target.value)}
                required
                className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#FF847C] focus:border-[#FF847C]"
              >
                {auditoriums.map((aud) => (
                  <option key={aud.auditorium_id} value={aud.auditorium_id}>
                    {aud.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Row Number (e.g. A)
              </label>
              <input
                type="text"
                value={rowNum}
                onChange={(e) => setRowNum(e.target.value.toUpperCase())}
                maxLength={2}
                required
                className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#FF847C] focus:border-[#FF847C]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seat Numbers (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. 1,2,3"
                value={seatNumbers}
                onChange={(e) => setSeatNumbers(e.target.value)}
                required
                className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#FF847C] focus:border-[#FF847C]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seat Type
              </label>
              <select
                value={seatType}
                onChange={(e) => setSeatType(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#FF847C] focus:border-[#FF847C]"
              >
                <option value="Normal">Normal</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#FF847C] hover:bg-[#e66c67] text-white font-semibold py-2.5 rounded-md shadow-md transition"
              >
                Add Seats
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
