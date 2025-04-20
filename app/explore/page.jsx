"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs"; // ✅ used for getting user data
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
  const [movies, setMovies] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  // Fetch movies from the backend
  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:3000/Movies");
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data); // Update state with fetched movies
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  };

  useEffect(() => {
    fetchMovies(); // Fetch movies on component mount
  }, []);

  useEffect(() => {
    if (user) {
      const syncUserToDB = async () => {
        try {
          await fetch("/api/sync-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clerkUserId: user.id,
              name: user.fullName,
              email: user.emailAddresses[0].emailAddress,
            }),
          });
        } catch (err) {
          console.error("Failed to sync user:", err);
        }
      };

      syncUserToDB();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8 bg-white text-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-center">Explore Movies</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.movie_id} // Use `movie_id` as key since it's unique
              onClick={() => router.push(`/explore/${movie.movie_id}`)}
              className="bg-gray-100 p-4 rounded-lg shadow hover:scale-[1.02] transition"
            >
              <Image
                src={movie.poster} // Directly use the poster URL stored in the database
                alt={movie.title}
                width={400}
                height={300}
                className="object-cover w-full h-60 rounded-md"
              />
              <h2 className="text-xl font-bold mt-4">{movie.title}</h2>
              <p className="text-sm text-gray-700 mt-1">{movie.genre}</p>
              <p className="text-yellow-600 font-semibold mt-2">
                Duration: {movie.duration_min} mins
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
