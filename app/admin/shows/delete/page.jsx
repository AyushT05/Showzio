"use client";
import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";

export default function ManageShowsPage() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingShowId, setEditingShowId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        async function fetchShows() {
            setLoading(true);
            const res = await fetch("/api/admin/get-shows");
            const data = await res.json();
            setShows(data);
            setLoading(false);
        }
        fetchShows();
    }, []);

    const handleDelete = async (showId) => {
        if (!window.confirm("Are you sure you want to delete this show?")) return;
        const res = await fetch("/api/admin/delete-show", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ showId }),
        });
        if (res.ok) {
            setShows(shows.filter((show) => show.show_id !== showId));
        } else {
            alert("Failed to delete show.");
        }
    };

    const handleEditClick = (show) => {
        setEditingShowId(show.show_id);
        setEditForm({
            start_time: show.start_time,
            end_time: show.end_time,
            price: show.price,
        });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSave = async (showId) => {
        const res = await fetch("/api/admin/update-show", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ showId, ...editForm }),
        });
        if (res.ok) {
            setShows(
                shows.map((show) =>
                    show.show_id === showId ? { ...show, ...editForm } : show
                )
            );
            setEditingShowId(null);
        } else {
            alert("Failed to update show.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Manage Movie Shows
                </h1>

                {loading ? (
                    <div className="text-center text-gray-500">Loading shows...</div>
                ) : shows.length === 0 ? (
                    <div className="text-center text-gray-600">No shows found.</div>
                ) : (
                    <div className="space-y-6">
                        {shows.map((show) => (
                            <div
                                key={show.show_id}
                                className="bg-white rounded-2xl shadow-md p-5 transition hover:shadow-lg"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold text-[#FF847C]">
                                            {show.movie_title}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {show.auditorium_name} ({show.theater_name})
                                        </p>

                                        <AnimatePresence mode="wait">
                                            {editingShowId === show.show_id ? (
                                                <motion.div
                                                    key="edit-form"
                                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden mt-4"
                                                >
                                                    <form
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            handleEditSave(show.show_id);
                                                        }}
                                                        className="flex flex-col sm:flex-row gap-3"
                                                    >
                                                        <input
                                                            type="datetime-local"
                                                            name="start_time"
                                                            value={editForm.start_time}
                                                            onChange={handleEditChange}
                                                            className="border rounded-lg px-3 py-2 w-full sm:w-auto"
                                                            required
                                                        />
                                                        <input
                                                            type="datetime-local"
                                                            name="end_time"
                                                            value={editForm.end_time}
                                                            onChange={handleEditChange}
                                                            className="border rounded-lg px-3 py-2 w-full sm:w-auto"
                                                            required
                                                        />
                                                        <input
                                                            type="number"
                                                            name="price"
                                                            value={editForm.price}
                                                            onChange={handleEditChange}
                                                            className="border rounded-lg px-3 py-2 w-full sm:w-auto"
                                                            min="0"
                                                            step="0.01"
                                                            required
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingShowId(null)}
                                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </form>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="info"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="mt-2 text-gray-700"
                                                >
                                                    <span className="block">
                                                         {new Date(show.start_time).toLocaleString()} -{" "}
                                                        {new Date(show.end_time).toLocaleString()}
                                                    </span>
                                                    <span className="block mt-1 text-yellow-600 font-medium">
                                                        ₹{show.price}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>



                                    {editingShowId !== show.show_id && (
                                        <div className="flex gap-3 mt-4 sm:mt-0">
                                            <button
                                                onClick={() => handleEditClick(show)}
                                                className="text-blue-500 hover:text-blue-700 bg-blue-100 p-2 rounded-full transition"
                                                title="Edit"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(show.show_id)}
                                                className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-full transition"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                        <div className="text-center mt-10">
                            <button
                            onClick={() => window.history.back()}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-md"
                        >
                            Back to Dashboard
                        </button>
                        </div>
                    </div>

                )}
            </div>
            <Footer />
        </>
    );
}
