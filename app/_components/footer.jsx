import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 pt-12 pb-8 px-4 sm:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* Logo and Description */}
        <div className="space-y-4">
         <Image src="/showzio.png" alt="Showzio Logo" width={140} height={140} className="inline-block mr-2 cursor-pointer"/>
          <p className="text-sm text-gray-600">
            Your one-stop destination to book, explore, and enjoy the latest movies.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-[#FF847C] transition">Home</a></li>
            <li><a href="#" className="hover:text-[#FF847C] transition">Browse Movies</a></li>
            <li><a href="#" className="hover:text-[#FF847C] transition">Locations</a></li>
            <li><a href="#" className="hover:text-[#FF847C] transition">Contact Us</a></li>
          </ul>
        </div>

        {/* Socials & Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Connect with Us</h3>
          <div className="flex gap-4">
            <a href="#"><Facebook className="hover:text-[#FF847C] transition" /></a>
            <a href="#"><Instagram className="hover:text-[#FF847C] transition" /></a>
            <a href="#"><Twitter className="hover:text-[#FF847C] transition" /></a>
            <a href="#"><Mail className="hover:text-[#FF847C] transition" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Showzio. All rights reserved.
      </div>
    </footer>
  );
}
