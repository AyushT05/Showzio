"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const { movieId } = params;

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovieShows() {
      try {
        setLoading(true);
        const res = await fetch(`/api/movie/${movieId}/shows`);
        if (!res.ok) throw new Error("Failed to fetch movie shows");
        const data = await res.json();
        setMovie(data.movie);
        setShows(data.shows);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieShows();
  }, [movieId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
          <h1 className="text-3xl font-semibold animate-pulse text-[#FF847C]">
            Loading showtimes...
          </h1>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
          <p className="text-lg font-medium">{error}</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
          <p className="text-lg font-medium">Movie not found</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-gray-100 min-h-screen py-14 px-6 md:px-20">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Movie Info */}
          <section className="flex flex-col md:flex-row items-start gap-10">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-64 h-auto rounded-xl shadow-lg border border-gray-300"
            />

            <div className="flex-1 space-y-4">
              <h1 className="text-4xl font-extrabold text-gray-900">
                {movie.title}
              </h1>
              <p className="text-gray-600 text-base">
                {movie.genre} | {movie.language} | {movie.dimension} |{" "}
                {movie.duration_min} mins
              </p>
              <p className="text-sm text-gray-500">
                Released on:{" "}
                {new Date(movie.release_date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <button
                className="mt-4 inline-block bg-[#FF847C] text-white font-semibold px-6 py-2 rounded-full shadow hover:bg-[#ff6b60] transition-all"
                onClick={() => router.push(`/explore/${movieId}`)}
              >
                Back to Movie Page
              </button>
            </div>
          </section>

          {/* Shows */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Available Showtimes
            </h2>

            {shows.length === 0 ? (
              <p className="text-gray-500">No shows available for this movie.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {shows.map((show) => (
                  <div
                    key={show.show_id}
                    onClick={() =>
                      router.push(`/book/${movieId}/show/${show.show_id}`)
                    }
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer hover:border-[#FF847C]"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      🎬 {show.theater_name} - {show.auditorium_name}
                    </h3>
                    <p className="text-gray-600">📍 {show.city}</p>
                    <p className="text-gray-600">
                      ⏰ {new Date(show.start_time).toLocaleString()} -{" "}
                      {new Date(show.end_time).toLocaleTimeString()}
                    </p>
                    <p className="text-[#FF847C] font-bold mt-2">
                      ₹{Number(show.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
