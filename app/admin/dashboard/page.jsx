"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/_components/navbar";
import Footer from "@/app/_components/footer";
import {
  Clapperboard,
  Building2,
  Rows3,
  CalendarClock,
  Armchair,
  Trash2,
  Settings,
  Edit,  // Added icon for delete actions from lucide-react
} from "lucide-react";

const actions = [
  {
    title: "Add Movie",
    route: "/admin/movies",
    icon: Clapperboard,
  },
  {
    title: "Add Theater",
    route: "/admin/theaters",
    icon: Building2,
  },
  {
    title: "Add Screen",
    route: "/admin/auditorium",
    icon: Rows3,
  },
  {
    title: "Add Show",
    route: "/admin/shows",
    icon: CalendarClock,
  },
  {
    title: "Add Seats",
    route: "/admin/seats",
    icon: Armchair,
  },
  // Delete actions
  {
    title: "Delete Movie",
    route: "/admin/movies/delete",
    icon: Trash2,
  },
  {
    title: "Delete Theater",
    route: "/admin/theaters/delete",
    icon: Trash2,
  },
  {
    title: "Delete Screen",
    route: "/admin/auditorium/delete",
    icon: Trash2,
  },
  {
    title: "Manage Shows",
    route: "/admin/shows/delete",
    icon: Edit,
  },
  {
    title: "Delete Seats",
    route: "/admin/seats/delete",
    icon: Trash2,
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 py-16 px-6 md:px-20">
        <h1 className="text-3xl font-bold text-left mb-12 text-gray-800 pl-32">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {actions.map(({ title, route, icon: Icon }) => (
            <div
              key={title}
              onClick={() => router.push(route)}
              className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 flex flex-col items-center text-center hover:scale-105"
            >
              <Icon className="w-12 h-12 text-[#FF847C] mb-4" />
              <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
