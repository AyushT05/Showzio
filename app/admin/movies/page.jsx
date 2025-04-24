"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";

export default function AddMovie() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Action");
  const [durationMin, setDurationMin] = useState(0);
  const [releaseDate, setReleaseDate] = useState("");
  const [language, setLanguage] = useState("");
  const [poster, setPoster] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [dimension, setDimension] = useState("2D");
  const [rating, setRating] = useState("");

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/admin/add-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          genre,
          durationMin,
          releaseDate,
          language,
          poster,
          trailerUrl,
          dimension,
          rating,
        }),
      });

      if (res.ok) {
        toast.success("🎉 Movie added successfully!");
        router.push("/admin/movies");
      } else {
        toast.error("❌ Failed to add movie. Please try again.");
      }
    } catch (err) {
      console.error("Failed to add movie:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl bg-white p-10 rounded-3xl shadow-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add a New Movie
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Movie Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                placeholder="e.g. Oppenheimer"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
              >
                <option>Action</option>
                <option>Comedy</option>
                <option>Drama</option>
                <option>Horror</option>
                <option>Romance</option>
                <option>Sci-Fi</option>
                <option>Thriller</option>
                <option>Fantasy</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Duration (in minutes)
              </label>
              <input
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                placeholder="e.g. 120"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Release Date
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Language
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                placeholder="e.g. English, Hindi"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Poster URL
              </label>
              <input
                type="text"
                value={poster}
                onChange={(e) => setPoster(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                placeholder="https://yourdomain.com/poster.jpg"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Dimension
              </label>
              <select
                value={dimension}
                onChange={(e) => setDimension(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Rating
              </label>
              <input
                type="text"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                placeholder="e.g. 8.5"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Trailer URL
              </label>
              <input
                type="text"
                value={trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <button
                type="submit"
                className="bg-[#FF847C] hover:bg-[#ff6a62] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-md"
              >
                + Add Movie
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
      </main>
      <Footer />
    </>
  );
}
