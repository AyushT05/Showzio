"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddAuditorium() {
  const [theaters, setTheaters] = useState([]);
  const [theaterId, setTheaterId] = useState("");
  const [name, setName] = useState("");
  const [totalSeats, setTotalSeats] = useState(50);
  const router = useRouter();

  useEffect(() => {
    // Fetch theaters for dropdown
    fetch("/api/admin/get-theaters")
      .then((res) => res.json())
      .then((data) => {
        setTheaters(data);
        if (data.length > 0) setTheaterId(data[0].theater_id);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/add-auditorium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theaterId, name, totalSeats }),
      });

      if (!res.ok) throw new Error("Failed to add auditorium");

      router.push("/admin/auditorium");
    } catch (err) {
      console.error(err);
      alert("Error adding auditorium");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Auditorium</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <input
          type="text"
          placeholder="Auditorium Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Total Seats"
          value={totalSeats}
          onChange={(e) => setTotalSeats(Number(e.target.value))}
          min={1}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Add Auditorium
        </button>
      </form>
    </div>
  );
}
