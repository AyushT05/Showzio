"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn } = useUser();

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

        {/* Center: Nav links */}
        <ul className="hidden sm:flex space-x-6 text-gray-700 font-medium">
          <li>
            <Link href="/now-showing" className="hover:text-[#FF847C] transition">Now Showing</Link>
          </li>
          <li>
            <Link href="/upcoming" className="hover:text-[#FF847C] transition">Upcoming</Link>
          </li>
          <li>
            <Link href="/theatres" className="hover:text-[#FF847C] transition">Theatres</Link>
          </li>
        </ul>

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
    </header>
  );
};

export default Navbar;
