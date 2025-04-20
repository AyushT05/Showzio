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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-[#FF847C] mb-10">
            🎬 Add New Movie
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                placeholder="Movie Title"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
              >
                <option>Action</option>
                <option>Comedy</option>
                <option>Drama</option>
                <option>Horror</option>
                <option>Romance</option>
                <option>Sci-Fi</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Duration (in minutes)</label>
              <input
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Release Date</label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                placeholder="e.g., English, Hindi"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Poster URL</label>
              <input
                type="text"
                value={poster}
                onChange={(e) => setPoster(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                placeholder="https://image.url/poster.jpg"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Trailer URL</label>
              <input
                type="text"
                value={trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF847C]"
                placeholder="https://youtube.com/..."
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="bg-[#FF847C] hover:bg-[#ff6a62] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-md"
              >
                + Add Movie
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
