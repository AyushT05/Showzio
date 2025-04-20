"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTheater() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [totalAuditoriums, setTotalAuditoriums] = useState(1);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/add-theater", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, totalAuditoriums }),
      });

      if (!res.ok) throw new Error("Failed to add theater");

      router.push("/admin/theaters"); // Redirect or show success message
    } catch (err) {
      console.error(err);
      alert("Error adding theater");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Theater</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Theater Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Total Auditoriums"
          value={totalAuditoriums}
          onChange={(e) => setTotalAuditoriums(Number(e.target.value))}
          min={1}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Add Theater
        </button>
      </form>
    </div>
  );
}
