"use client";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";
import Image from "next/image";

export default function MovieDeletePage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMovies() {
            setLoading(true);
            const res = await fetch("/api/admin/get-movies");
            const data = await res.json();
            setMovies(data);
            setLoading(false);
        }
        fetchMovies();
    }, []);

    const handleDelete = async (movieId) => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;
        const res = await fetch("/api/admin/delete-movie", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movieId }),
        });
        if (res.ok) {
            setMovies(movies.filter((movie) => movie.movie_id !== movieId));
        } else {
            alert("Failed to delete movie.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
                <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-4xl">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                        Delete Movies
                    </h1>

                    {loading ? (
                        <p className="text-center text-gray-500">Loading movies...</p>
                    ) : movies.length === 0 ? (
                        <p className="text-center text-gray-500">No movies found.</p>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {movies.map((movie) => (
                                <li
                                    key={movie.movie_id}
                                    className="relative rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-300 overflow-hidden h-36 cursor-pointer group"
                                    style={{
                                        backgroundImage: `url(${movie.poster})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    {/* Constant subtle black tint overlay */}
                                    <div
                                        className="absolute inset-0"
                                        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                                    ></div>


                                    {/* Blur overlay only on hover */}
                                    <div
                                        className="absolute inset-0 pointer-events-none transition-backdrop duration-300 group-hover:backdrop-blur-sm"
                                        style={{ backgroundColor: "transparent" }}
                                    ></div>

                                    {/* Content container */}
                                    <div className="relative flex items-center justify-between h-full px-6">
                                        <h2 className="text-white text-xl font-semibold drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                                            {movie.title}
                                        </h2>
                                        <button
                                            onClick={() => handleDelete(movie.movie_id)}
                                            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 shadow-lg"
                                            title={`Delete ${movie.title}`}
                                            aria-label={`Delete ${movie.title}`}
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
            <Footer />
        </>
    );
}
