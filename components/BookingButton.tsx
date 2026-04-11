"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/app/_utils/firebase";

type BookingButtonProps = {
  eventId: string;
  disabled?: boolean;
};

export default function BookingButton({ eventId, disabled }: BookingButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!auth.currentUser) {
      router.push(`/login?redirect=/events/${eventId}/book`);
      return;
    }
    router.push(`/events/${eventId}/book`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="mt-5 w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {disabled ? "Sold Out" : "Book Now"}
    </button>
  );
}
