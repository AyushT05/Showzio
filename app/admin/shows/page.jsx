"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddShow() {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  
  const [movieId, setMovieId] = useState("");
  const [theaterId, setTheaterId] = useState("");
  const [filteredAuditoriums, setFilteredAuditoriums] = useState([]);
  const [auditoriumId, setAuditoriumId] = useState("");
  
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState(100);
  
  const router = useRouter();

  // Fetch movies and theaters on mount
  useEffect(() => {
    fetch("/api/admin/get-movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        if (data.length > 0) setMovieId(data[0].movie_id);
      });

    fetch("/api/admin/get-theaters")
      .then((res) => res.json())
      .then((data) => {
        setTheaters(data);
        if (data.length > 0) setTheaterId(data[0].theater_id);
      });

    fetch("/api/admin/get-auditoriums")
      .then((res) => res.json())
      .then((data) => {
        setAuditoriums(data);
      });
  }, []);

  // Filter auditoriums when theaterId or auditoriums change
  useEffect(() => {
    if (theaterId) {
      const filtered = auditoriums.filter(
        (aud) => aud.theater_id.toString() === theaterId.toString()
      );
      setFilteredAuditoriums(filtered);
      if (filtered.length > 0) setAuditoriumId(filtered[0].auditorium_id);
      else setAuditoriumId("");
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

      router.push("/admin/shows");
    } catch (err) {
      console.error(err);
      alert("Error adding show");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Show</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Movie select */}
        <select
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          required
          className="border p-2 rounded"
        >
          {movies.map((movie) => (
            <option key={movie.movie_id} value={movie.movie_id}>
              {movie.title}
            </option>
          ))}
        </select>

        {/* Theater select */}
        <select
          value={theaterId}
          onChange={(e) => setTheaterId(e.target.value)}
          required
          className="border p-2 rounded"
        >
          {theaters.map((theater) => (
            <option key={theater.theater_id} value={theater.theater_id}>
              {theater.name} ({theater.city})
            </option>
          ))}
        </select>

        {/* Auditorium select filtered by theater */}
        <select
          value={auditoriumId}
          onChange={(e) => setAuditoriumId(e.target.value)}
          required
          className="border p-2 rounded"
          disabled={filteredAuditoriums.length === 0}
        >
          {filteredAuditoriums.length === 0 ? (
            <option>No auditoriums available</option>
          ) : (
            filteredAuditoriums.map((aud) => (
              <option key={aud.auditorium_id} value={aud.auditorium_id}>
                {aud.name}
              </option>
            ))
          )}
        </select>

        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="border p-2 rounded"
        />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Add Show
        </button>
      </form>
    </div>
  );
}
