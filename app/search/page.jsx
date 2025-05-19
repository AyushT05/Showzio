"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setMovies([]);
            return;
        }
        setLoading(true);
        fetch(`/api/search-movies?query=${encodeURIComponent(query)}`)
            .then((res) => res.json())
            .then((data) => setMovies(data))
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6">
                    Search results for <span className="text-[#FF847C]">"{query}"</span>
                </h1>
                {loading ? (
                    <div>Loading...</div>
                ) : !query ? (
                    <div>Type something to search for movies.</div>
                ) : movies.length === 0 ? (
                    <div>No movies found.</div>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {movies.map((movie) => (
                            <li
                                key={movie.movie_id}
                                className="bg-gray-100 rounded-lg shadow hover:scale-[1.02] transition cursor-pointer overflow-hidden"
                            >
                                <Link href={`/movie/${movie.movie_id}`} className="flex flex-col">
                                    <Image
                                        src={movie.poster || "/placeholder.jpg"}
                                        alt={movie.title}
                                        width={600}
                                        height={300}
                                        className="object-cover w-full h-[200px]"
                                    />
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold">{movie.title}</h2>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {movie.genre} | {movie.language}
                                        </p>
                                        {movie.duration_min && (
                                            <p className="text-yellow-600 font-semibold mt-2">
                                                Duration: {movie.duration_min} mins
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Footer />
        </>
    );

}
