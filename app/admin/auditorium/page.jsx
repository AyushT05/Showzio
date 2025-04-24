"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";

export default function AddAuditorium() {
  const [theaters, setTheaters] = useState([]);
  const [theaterId, setTheaterId] = useState("");
  const [name, setName] = useState("");
  const [totalSeats, setTotalSeats] = useState(50);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/get-theaters")
      .then((res) => res.json())
      .then((data) => {
        setTheaters(data);
        if (data.length > 0) setTheaterId(data[0].theater_id);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/add-auditorium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theaterId, name, totalSeats }),
      });

      if (res.ok) {
        toast.success("🎉 Screen added successfully!");
        router.push("/admin/auditorium");
      } else {
        toast.error("❌ Failed to add screen. Please try again.");
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
            Add New Screen
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Select Theater</label>
              <select
                value={theaterId}
                onChange={(e) => setTheaterId(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              >
                {theaters.map((theater) => (
                  <option key={theater.theater_id} value={theater.theater_id}>
                    {theater.name} ({theater.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Screen Name</label>
              <input
                type="text"
                placeholder="Enter screen name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Total Seats</label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                min={1}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              />
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <button
                type="submit"
                className="bg-[#FF847C] hover:bg-[#ff6a62] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md"
              >
                + Add Screen
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
