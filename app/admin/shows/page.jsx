"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";

export default function AddShow() {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [filteredAuditoriums, setFilteredAuditoriums] = useState([]);

  const [movieId, setMovieId] = useState("");
  const [theaterId, setTheaterId] = useState("");
  const [auditoriumId, setAuditoriumId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState(100);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, theatersRes, audsRes] = await Promise.all([
          fetch("/api/admin/get-movies"),
          fetch("/api/admin/get-theaters"),
          fetch("/api/admin/get-auditoriums"),
        ]);

        const movieData = await moviesRes.json();
        const theaterData = await theatersRes.json();
        const auditoriumData = await audsRes.json();

        if (Array.isArray(movieData)) {
          setMovies(movieData);
          if (movieData.length > 0) setMovieId(movieData[0].movie_id);
        }

        if (Array.isArray(theaterData)) {
          setTheaters(theaterData);
          if (theaterData.length > 0) setTheaterId(theaterData[0].theater_id);
        }

        if (Array.isArray(auditoriumData)) {
          setAuditoriums(auditoriumData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("❌ Error loading data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (theaterId) {
      const filtered = auditoriums.filter(
        (aud) => aud.theater_id.toString() === theaterId.toString()
      );
      setFilteredAuditoriums(filtered);
      setAuditoriumId(filtered.length > 0 ? filtered[0].auditorium_id : "");
    }
  }, [theaterId, auditoriums]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/add-show", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, auditoriumId, startTime, endTime, price }),
      });

      if (!res.ok) throw new Error("Failed to add show");

      toast.success("🎬 Show added successfully!");
      router.push("/admin/shows");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add show");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add New Show
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Movie selection */}
            <div>
              <label className="block mb-1 font-medium">Movie</label>
              <select
                value={movieId}
                onChange={(e) => setMovieId(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              >
                {movies.map((movie) => (
                  <option key={movie.movie_id} value={movie.movie_id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Theater selection */}
            <div>
              <label className="block mb-1 font-medium">Theater</label>
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

            {/* Auditorium selection */}
            <div>
              <label className="block mb-1 font-medium">Screen</label>
              <select
                value={auditoriumId}
                onChange={(e) => setAuditoriumId(e.target.value)}
                disabled={filteredAuditoriums.length === 0}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              >
                {filteredAuditoriums.length === 0 ? (
                  <option>No screens available</option>
                ) : (
                  filteredAuditoriums.map((aud) => (
                    <option key={aud.auditorium_id} value={aud.auditorium_id}>
                      {aud.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Start & End time */}
            <div>
              <label className="block mb-1 font-medium">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              />
            </div>

            {/* Price input */}
            <div>
              <label className="block mb-1 font-medium">Price (₹)</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                type="submit"
                className="bg-[#FF847C] hover:bg-[#ff6a62] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md"
              >
                + Add Show
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
