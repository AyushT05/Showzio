"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Search } from "lucide-react"; // Add this if using Lucide icons (or use your preferred icon lib)

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left: Logo */}
        <div className="text-2xl font-bold text-[#FF847C] tracking-tight">
          <Link href="/">
            <Image
              src="/showzio.png"
              alt="Showzio Logo"
              width={140}
              height={140}
              className="inline-block mr-2 cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 mx-4 max-w-md hidden sm:flex"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pr-12 pl-4 bg-[#FFF3F2] text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF847C] placeholder:text-gray-500"
              style={{ border: "none" }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF847C] text-white rounded-full p-2 hover:bg-[#e66c67] transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="sm:hidden px-4 py-2"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pr-12 pl-4 bg-[#FFF3F2] text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF847C] placeholder:text-gray-500"
              style={{ border: "none" }}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#FF847C] text-white rounded-full p-2 hover:bg-[#e66c67] transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>


        {/* Right: Auth */}
        <div className="space-x-4 hidden sm:flex items-center">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <SignInButton>
                <button className="px-4 py-2 rounded-lg text-sm font-medium border border-[#FF847C] text-[#FF847C] hover:bg-[#FF847C] hover:text-white transition">
                  Login
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-[#FF847C] text-white hover:bg-[#e46d64] transition">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile: Placeholder for menu icon */}
        <div className="sm:hidden">
          <button className="text-gray-700">☰</button>
        </div>
      </nav>
      {/* Mobile search bar below navbar */}
      <form
        onSubmit={handleSearchSubmit}
        className="sm:hidden px-4 py-2"
      >
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF847C] transition"
        />
      </form>
    </header>
  );
};

export default Navbar;
