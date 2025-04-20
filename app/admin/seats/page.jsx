"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddSeats() {
  const [auditoriums, setAuditoriums] = useState([]);
  const [auditoriumId, setAuditoriumId] = useState("");
  const [rowNum, setRowNum] = useState("");
  const [seatNumbers, setSeatNumbers] = useState(""); // comma separated seat numbers
  const [seatType, setSeatType] = useState("Normal");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/get-auditoriums")
      .then((res) => res.json())
      .then((data) => {
        setAuditoriums(data);
        if (data.length > 0) setAuditoriumId(data[0].auditorium_id);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse seat numbers
    const seats = seatNumbers
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    try {
      const res = await fetch("/api/admin/add-seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditoriumId, rowNum, seats, seatType }),
      });

      if (!res.ok) throw new Error("Failed to add seats");

      router.push("/admin/seats");
    } catch (err) {
      console.error(err);
      alert("Error adding seats");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Seats</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          value={auditoriumId}
          onChange={(e) => setAuditoriumId(e.target.value)}
          required
          className="border p-2 rounded"
        >
          {auditoriums.map((aud) => (
            <option key={aud.auditorium_id} value={aud.auditorium_id}>
              {aud.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Row (e.g. A)"
          value={rowNum}
          onChange={(e) => setRowNum(e.target.value.toUpperCase())}
          maxLength={2}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Seat numbers (comma separated, e.g. 1,2,3)"
          value={seatNumbers}
          onChange={(e) => setSeatNumbers(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <select
          value={seatType}
          onChange={(e) => setSeatType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Normal">Normal</option>
          <option value="Premium">Premium</option>
          <option value="VIP">VIP</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Add Seats
        </button>
      </form>
    </div>
  );
}
