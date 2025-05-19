"use client";
import { useUser } from "@clerk/nextjs";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BookingSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { showId } = useParams();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!sessionId || !user?.id || !showId) return;
    fetch(`/api/update-booking-session/${user?.id}/${showId}/${sessionId}`, {
      method: "POST",
    });
  }, [sessionId, user, showId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Booking Successful!</h1>
        <p className="text-gray-600 mb-4">
          Your payment was processed successfully. Check your email for confirmation.
        </p>
        <p className="text-sm text-gray-500 mb-2 break-words">
          <span className="font-medium">Transaction ID:</span> {sessionId}
        </p>

        <button
          className="mt-4 bg-[#FF847C] hover:bg-[#e66c67] px-6 py-2 rounded text-white font-semibold"
          onClick={() => router.push(`/ticket/${sessionId}`)}
        >
          View Ticket
        </button>
      </div>
    </div>
  );
}
