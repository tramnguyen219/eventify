"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import { getUserBookings, cancelBooking } from "@/app/_services/eventService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Booking = {
  id: string;
  eventId: string;
  title: string;
  date: string;
  location: string;
  status: "confirmed" | "pending" | "cancelled";
  tickets: number;
  totalAmount: number;
  event?: any;
};

export default function AttendeeDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        
        // Fetch user's bookings
        try {
          const userBookings = await getUserBookings(currentUser.uid);
          const formattedBookings: Booking[] = userBookings.map((booking: any) => ({
            id: booking.id,
            eventId: booking.event?.id || booking.eventId || "",
            title: booking.event?.title || booking.title || "",
            date: booking.event?.date || booking.date || "",
            location: booking.event?.location || booking.location || "",
            status: booking.status || "pending",
            tickets: booking.tickets || 0,
            totalAmount: booking.totalAmount || 0,
            event: booking.event || null,
          }));
          setBookings(formattedBookings);
        } catch (err) {
          console.error("Error fetching bookings:", err);
          setError("Failed to load your bookings");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleCancelBooking = async (bookingId: string, eventId: string, tickets: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(bookingId);
    
    try {
      await cancelBooking(bookingId, eventId, tickets);
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "cancelled" as const }
          : booking
      ));
      
      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const activeBookings = bookings.filter(b => b.status === "confirmed");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");

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

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">My Attendee Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Welcome back, {user.displayName || user.email?.split('@')[0]}! Manage your event registrations here.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total Bookings</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{bookings.length}</h2>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Active Bookings</p>
            <h2 className="mt-3 text-3xl font-bold text-green-600">{activeBookings.length}</h2>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total Spent</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              ${bookings.reduce((sum, b) => sum + (b.status === "confirmed" ? b.totalAmount : 0), 0)}
            </h2>
          </div>
        </div>

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Active Bookings</h2>
            <div className="grid gap-6">
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900">{booking.title}</h3>
                      <div className="mt-2 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
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
                        <p className="flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                          </svg>
                          {booking.tickets} ticket{booking.tickets > 1 ? "s" : ""}
                        </p>
                        <p className="flex items-center gap-2 font-semibold text-blue-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ${booking.totalAmount}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-center text-xs font-semibold text-green-700">
                        {booking.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleCancelBooking(booking.id, booking.eventId, booking.tickets)}
                        disabled={cancellingId === booking.id}
                        className="rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 disabled:opacity-50"
                      >
                        {cancellingId === booking.id ? "Cancelling..." : "Cancel Booking"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancelled Bookings */}
        {cancelledBookings.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Cancelled Bookings</h2>
            <div className="grid gap-6">
              {cancelledBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 opacity-75"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{booking.title}</h3>
                      <div className="mt-2 space-y-1 text-sm text-slate-600">
                        <p>{booking.date}</p>
                        <p>{booking.location}</p>
                        <p>{booking.tickets} tickets • ${booking.totalAmount}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-center text-xs font-semibold text-red-700">
                      CANCELLED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Bookings */}
        {bookings.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No bookings yet</h3>
            <p className="mt-2 text-slate-600">You haven't registered for any events.</p>
            <Link
              href="/events"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Browse Events
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/events"
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-slate-900">Discover Events</p>
                <p className="text-sm text-slate-600">Find and register for new events</p>
              </div>
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-slate-900">Main Dashboard</p>
                <p className="text-sm text-slate-600">Access all dashboard features</p>
              </div>
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}