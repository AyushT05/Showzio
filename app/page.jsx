"use client"
import { Ticket, Film, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";


const heroImages = ["/showzio-bg.jpg"];


export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // change image every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-white text-gray-900 px-4 sm:px-8 py-12 space-y-24">

      {/* Hero Section with Zooming Slideshow */}
      <section className="relative w-full h-96 sm:h-[32rem] rounded-xl overflow-hidden">
        <Image
          src="/showzio-bg.jpg"
          alt="Movie banner"
          fill
          className="object-cover animate-zoom-once"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 space-y-4 text-white">
          <h1 className="text-4xl sm:text-5xl font-bold">Welcome to Showzio</h1>
          <p className="text-lg sm:text-xl max-w-2xl">
            Your one-stop destination to book, explore, and enjoy the latest movies.
          </p>
        </div>
      </section>


      {/* Features Section with Lucide Icons */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {[
          {
            title: "Easy Booking",
            desc: "Book your favorite seats in just a few taps.",
            icon: <Ticket size={48} className="mx-auto text-[#FF847C]" />,
          },
          {
            title: "Trending Movies",
            desc: "Stay updated with the latest blockbusters.",
            icon: <Film size={48} className="mx-auto text-[#FF847C]" />,
          },
          {
            title: "Multiple Locations",
            desc: "Find cinemas near you in seconds.",
            icon: <MapPin size={48} className="mx-auto text-[#FF847C]" />,
          },
        ].map(({ title, desc, icon }, i) => (
          <div key={i} className="group space-y-4 ">
            <div className="flex justify-center items-center">
              <div className="transition-transform duration-300 group-hover:scale-130">
                {icon}
              </div>
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>


        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold">Ready to book your next show?</h2>
        <p className="text-gray-600 text-lg">
          Explore showtimes and secure your seats now.
        </p>
        <Link href="/explore">
          <button className="bg-[#FF847C] hover:bg-[#ff6f66] text-white font-semibold px-6 py-3 rounded-lg transition duration-300">
            Browse Movies
          </button>
        </Link>
      </section>
    </main>
    <Footer/>
    </>
  );
}
