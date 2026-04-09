"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// This would normally come from Firebase/Firestore
// Mock data structure that would be fetched from your database
type Booking = {
  id: number;
  title: string;
  date: string;
  location: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  tickets?: number;
  totalAmount?: number;
};

export default function BookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Redirect to login if not authenticated
        router.push("/login");
      } else {
        setUser(currentUser);
        // TODO: Fetch actual bookings from Firebase/Firestore
        // For now, using mock data that would be user-specific
        setBookings([
          {
            id: 1,
            title: "Future Innovators Summit",
            date: "April 18, 2026",
            location: "Calgary, AB",
            status: "Confirmed",
            tickets: 2,
            totalAmount: 120,
          },
          {
            id: 2,
            title: "Business Networking Night",
            date: "May 2, 2026",
            location: "Calgary, AB",
            status: "Confirmed",
            tickets: 1,
            totalAmount: 45,
          },
        ]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(bookingId);
    
    try {
      // TODO: Update booking status in Firebase/Firestore
      // For now, just update local state
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "Cancelled" as const }
          : booking
      ));
      
      // Show success message (you can add a toast notification here)
      console.log("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
        <Footer />
      </main>
    );
  }

  // Don't render anything while redirecting
  if (!user) {
    return null;
  }

  const activeBookings = bookings.filter(b => b.status !== "Cancelled");
  const cancelledBookings = bookings.filter(b => b.status === "Cancelled");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            My Bookings
          </p>
          <h1 className="text-4xl font-bold text-slate-900">Manage your bookings</h1>
          <p className="mt-3 text-slate-600">
            View your registered events and manage your event attendance.
          </p>
        </div>

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">Active Bookings</h2>
            <div className="grid gap-6">
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {booking.title}
                      </h2>
                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {booking.date}
                        </p>
                        <p className="flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {booking.location}
                        </p>
                        {booking.tickets && (
                          <p className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                            </svg>
                            {booking.tickets} ticket{booking.tickets > 1 ? "s" : ""} • ${booking.totalAmount}
                          </p>
                        )}
                        <p>
                          Status:{" "}
                          <span className="font-semibold text-green-600">
                            {booking.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {cancellingId === booking.id ? (
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Cancelling...
                        </div>
                      ) : (
                        "Cancel Booking"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancelled Bookings */}
        {cancelledBookings.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">Cancelled Bookings</h2>
            <div className="grid gap-6">
              {cancelledBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 opacity-75"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {booking.title}
                      </h2>
                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <p>{booking.date}</p>
                        <p>{booking.location}</p>
                        <p>
                          Status:{" "}
                          <span className="font-semibold text-red-600">
                            {booking.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Bookings Message */}
        {bookings.length === 0 && (
          <div className="rounded-[28px] bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No bookings yet</h3>
            <p className="mt-2 text-slate-600">
              You haven't registered for any events.
            </p>
            <a
              href="/events"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Browse Events
            </a>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}