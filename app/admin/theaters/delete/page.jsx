"use client";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";

export default function TheaterDeletePage() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTheaters() {
      setLoading(true);
      const res = await fetch("/api/admin/get-theaters");
      const data = await res.json();
      setTheaters(data);
      setLoading(false);
    }
    fetchTheaters();
  }, []);

  const handleDelete = async (theaterId) => {
    if (!window.confirm("Are you sure you want to delete this theater?")) return;
    const res = await fetch("/api/admin/delete-theater", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theaterId }),
    });
    if (res.ok) {
      setTheaters(theaters.filter((theater) => theater.theater_id !== theaterId));
    } else {
      alert("Failed to delete theater.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Delete Theaters
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading theaters...</p>
        ) : theaters.length === 0 ? (
          <p className="text-center text-gray-500">No theaters found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {theaters.map((theater) => (
              <li
                key={theater.theater_id}
                className="relative rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-300 overflow-hidden h-28 cursor-pointer group bg-gradient-to-br from-gray-50 to-gray-100"
              >
                {/* Overlay for hover blur effect */}
                <div
                  className="absolute inset-0 pointer-events-none transition-backdrop duration-300 group-hover:backdrop-blur-sm"
                  style={{ backgroundColor: "transparent" }}
                ></div>

                <div className="relative flex items-center justify-between h-full px-6">
                  <h2 className="text-gray-900 text-xl font-semibold drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                    {theater.name} <span className="text-gray-600 text-sm font-normal">({theater.city})</span>
                  </h2>
                  <button
                    onClick={() => handleDelete(theater.theater_id)}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 shadow-lg"
                    title={`Delete ${theater.name}`}
                    aria-label={`Delete ${theater.name}`}
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center mt-10">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
