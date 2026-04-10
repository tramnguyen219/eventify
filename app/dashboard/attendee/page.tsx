"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Booking = {
  id: string;
  eventTitle: string;
  date: string;
  location: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  eventId: string;
};

type SavedEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
};

export default function AttendeeDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);

        // TODO: groupmate will replace with Firestore queries
        // e.g. getDocs(query(collection(db, "bookings"), where("attendeeId", "==", currentUser.uid)))
        const mockBookings: Booking[] = [
          {
            id: "b1",
            eventTitle: "Future Innovators Summit",
            date: "April 18, 2026",
            location: "Calgary, AB",
            status: "Confirmed",
            eventId: "1",
          },
          {
            id: "b2",
            eventTitle: "Business Networking Night",
            date: "May 2, 2026",
            location: "Calgary, AB",
            status: "Confirmed",
            eventId: "3",
          },
        ];

        // TODO: groupmate will replace with Firestore query for saved events
        const mockSaved: SavedEvent[] = [
          { id: "3", title: "Creative Design Workshop", date: "April 22, 2026", location: "Edmonton, AB" },
          { id: "5", title: "Student Career Expo", date: "May 15, 2026", location: "Calgary, AB" },
        ];

        setBookings(mockBookings);
        setSavedEvents(mockSaved);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleRemoveSaved = (eventId: string) => {
    // TODO: groupmate will remove from Firestore saved collection
    setSavedEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) return null;

  const upcomingBookings = bookings.filter((b) => b.status !== "Cancelled");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Attendee Dashboard
          </p>
          <h1 className="text-4xl font-bold text-slate-900">
            Welcome back, {user.displayName || user.email?.split("@")[0]}!
          </h1>
          <p className="mt-3 text-slate-600">
            View your upcoming events, saved events, and bookings all in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Upcoming Events</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{upcomingBookings.length}</h2>
          </div>
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Saved Events</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{savedEvents.length}</h2>
          </div>
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Active Bookings</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{upcomingBookings.length}</h2>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Upcoming Bookings */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">My Bookings</h2>
            {upcomingBookings.length === 0 ? (
              <div className="rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-slate-600">No upcoming bookings yet.</p>
                <Link href="/events" className="mt-4 inline-block rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="grid gap-5">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-slate-900">{booking.eventTitle}</h3>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {booking.status}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      <p>{booking.date}</p>
                      <p>{booking.location}</p>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <Link href={`/events/${booking.eventId}`}
                        className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                        View Event
                      </Link>
                      <Link href="/dashboard/bookings"
                        className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                        Manage Booking
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Events */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Saved Events</h2>
            {savedEvents.length === 0 ? (
              <div className="rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-slate-600">No saved events yet.</p>
                <Link href="/events" className="mt-4 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                  Explore Events
                </Link>
              </div>
            ) : (
              <div className="grid gap-5">
                {savedEvents.map((event) => (
                  <div key={event.id} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      <p>{event.date}</p>
                      <p>{event.location}</p>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <Link href={`/events/${event.id}`}
                        className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                        View Details
                      </Link>
                      <button onClick={() => handleRemoveSaved(event.id)}
                        className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Browse CTA */}
        <div className="mt-12 rounded-[28px] bg-slate-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Discover more events</h2>
          <p className="mt-2 text-slate-300">Find events that match your interests.</p>
          <Link href="/events"
            className="mt-6 inline-block rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Browse All Events
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
