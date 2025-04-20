import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import {
  ClerkProvider,
  GoogleOneTap
} from '@clerk/nextjs'
import { Toaster } from "react-hot-toast";

// Load Outfit font
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Showzio",
  description: "Your one-stop shop for all things showbiz",
  
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <GoogleOneTap/>

    <html lang="en" className={outfit.variable}>
      <body className="antialiased">
        <Toaster position="top-center" reverseOrder={false} />
        {children}
        
      </body>
    </html>
    </ClerkProvider>
  );
}
