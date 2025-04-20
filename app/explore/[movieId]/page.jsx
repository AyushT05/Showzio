"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";
import { Star } from "lucide-react";

export default function MoviePage() {
  const [movie, setMovie] = useState(null);
  const params = useParams();
  const router = useRouter();
  const movieId = params.movieId;

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`/api/movie/${movieId}`);
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (!movie) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
          <h1 className="text-3xl font-semibold animate-pulse text-[#FF847C]">Loading...</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative w-full bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${movie.poster})` }}
      >
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="relative z-10 text-left py-20 px-4 md:px-20">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-10 drop-shadow-lg">{movie.title}</h1>
          <div className="w-full mx-auto aspect-video rounded-xl overflow-hidden border border-white/20 shadow-2xl">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${extractYouTubeID(movie.trailer_url)}?autoplay=1&mute=1`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Details Section - Now Light Themed */}
      <main className="bg-gray-100 text-gray-800 py-12 px-6 md:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 items-start">

          {/* Poster Card */}
          <div className="w-full md:w-1/3 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-auto object-cover"
            />
            <p className="text-center py-2 text-sm bg-gray-100 text-gray-500 font-medium">
              🎥 Now showing
            </p>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-6">
            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#FF847C] px-4 py-1 rounded-full text-sm font-medium text-white shadow">
                <Star className="w-4 h-4 fill-white" />
                {movie.rating || "9.1"}/10 <span className="text-white/90">IMDB</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-3 flex-wrap">
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                {movie.dimension}
              </span>
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                {movie.language || "Hindi"}
              </span>
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm shadow-sm">
                {movie.genre}
              </span>
            </div>

            {/* Duration, genre, release */}
            <p className="text-gray-600 text-sm">
              ⏱ {movie.duration_min} mins • {movie.genre} • UA16+ •{" "}
              {new Date(movie.release_date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>

            {/* Book Button */}
            <button
              onClick={() => router.push(`/book/${movieId}`)}
              className="mt-4 bg-[#FF847C] hover:bg-[#ff6a62] text-white font-semibold text-base px-6 py-2 rounded-xl shadow transition-all duration-300"
            >
              Book Tickets
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function extractYouTubeID(url) {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
  );
  return match ? match[1] : "";
}
