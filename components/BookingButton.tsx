"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/app/_utils/firebase";

export default function BookingButton({
  eventId,
  disabled,
}: {
  eventId: string | number;
  disabled?: boolean;
}) {
  const router = useRouter();

  const handleClick = () => {
    const user = auth.currentUser;
    if (!user) {
      router.push(`/login?redirect=/events/${eventId}/book`);
      return;
    }
    router.push(`/events/${eventId}/book`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="mt-6 block w-full rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {disabled ? "Sold Out" : "Book Now"}
    </button>
  );
}
