import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black/40">
      {/* Background image */}
      <Image
        src="/signin.jpg"
        alt="Background"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Sign-in form */}
      <div className="relative z-20 p-6 bg-white/90 rounded-xl shadow-lg backdrop-blur-md w-full max-w-md">
        <Image src="/showzio.png" alt="Logo" width={200} height={50} className="mx-auto mb-4" />
        <SignIn redirectUrl="/explore" />      
        </div>
    </div>
  );
}
