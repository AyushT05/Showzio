"use client";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";

function groupByTheater(auditoriums) {
  const grouped = {};
  for (const a of auditoriums) {
    if (!grouped[a.theater_id]) {
      grouped[a.theater_id] = {
        theater_name: a.theater_name,
        theater_city: a.theater_city,
        screens: [],
      };
    }
    grouped[a.theater_id].screens.push(a);
  }
  return grouped;
}

export default function ScreenDeletePage() {
  const [auditoriums, setAuditoriums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuditoriums() {
      setLoading(true);
      const res = await fetch("/api/admin/get-auditoriums");
      const data = await res.json();
      setAuditoriums(data);
      setLoading(false);
    }
    fetchAuditoriums();
  }, []);

  const handleDelete = async (auditoriumId) => {
    if (!window.confirm("Are you sure you want to delete this screen?")) return;
    const res = await fetch("/api/admin/delete-auditorium", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auditoriumId }),
    });
    if (res.ok) {
      setAuditoriums(auditoriums.filter((a) => a.auditorium_id !== auditoriumId));
    } else {
      alert("Failed to delete screen.");
    }
  };

  const grouped = groupByTheater(auditoriums);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
           Manage Screens
        </h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading screens...</div>
        ) : auditoriums.length === 0 ? (
          <div className="text-center text-gray-600">No screens found.</div>
        ) : (
          Object.entries(grouped).map(([theaterId, { theater_name, theater_city, screens }]) => (
            <div
              key={theaterId}
              className="bg-white rounded-2xl shadow-md p-6 mb-8 transition hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-[#FF847C] mb-4">
                {theater_name} <span className="text-gray-500">({theater_city})</span>
              </h2>
              <ul className="space-y-4">
                {screens.map((a) => (
                  <li
                    key={a.auditorium_id}
                    className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3 hover:bg-gray-200 transition"
                  >
                    <span className="text-gray-800 font-medium">
                      {a.auditorium_name} <span className="text-gray-500">(Seats: {a.total_seats})</span>
                    </span>
                    <button
                      onClick={() => handleDelete(a.auditorium_id)}
                      className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 p-2 rounded-full transition"
                      title="Delete Screen"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}

        {/* Back to Dashboard Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
