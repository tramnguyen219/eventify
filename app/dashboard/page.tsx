"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Tab = "organizer" | "attendee";

type OrganizerEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  seats: number;
  bookedSeats: number;
  status: "published" | "draft" | "cancelled";
};

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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("organizer");

  // Organizer data
  const [myEvents, setMyEvents] = useState<OrganizerEvent[]>([]);

  // Attendee data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);

        // TODO: groupmate replaces with Firestore queries
        setMyEvents([
          { id: "1", title: "Future Innovators Summit", date: "April 18, 2026", location: "Calgary, AB", seats: 120, bookedSeats: 45, status: "published" },
          { id: "2", title: "Creative Design Workshop", date: "April 22, 2026", location: "Edmonton, AB", seats: 40, bookedSeats: 12, status: "published" },
        ]);

        setBookings([
          { id: "b1", eventTitle: "Business Networking Night", date: "May 2, 2026", location: "Calgary, AB", status: "Confirmed", eventId: "3" },
        ]);

        setSavedEvents([
          { id: "5", title: "Student Career Expo", date: "May 15, 2026", location: "Calgary, AB" },
        ]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDeleteEvent = (eventId: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    // TODO: groupmate deletes from Firestore
    setMyEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const handleRemoveSaved = (eventId: string) => {
    // TODO: groupmate removes from Firestore
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
  const totalBookings = myEvents.reduce((sum, e) => sum + e.bookedSeats, 0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* Top header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Hi, {user.displayName || user.email?.split("@")[0]} 👋
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <Link
              href="/events"
              className="self-start rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:self-auto"
            >
              Browse Events
            </Link>
          </div>

          {/* Tab switcher */}
          <div className="mt-6 flex gap-1 border-b border-transparent">
            <button
              onClick={() => setActiveTab("organizer")}
              className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
                activeTab === "organizer"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              My Events
              {myEvents.length > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {myEvents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("attendee")}
              className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
                activeTab === "attendee"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              My Bookings
              {upcomingBookings.length > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {upcomingBookings.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* ── ORGANIZER TAB ── */}
        {activeTab === "organizer" && (
          <div>
            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Total Events</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{myEvents.length}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Total Bookings</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{totalBookings}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Published Events</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {myEvents.filter((e) => e.status === "published").length}
                </p>
              </div>
            </div>

            {/* Events list */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Your Events</h2>
              <Link
                href="/dashboard/organizer/create"
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                + Create Event
              </Link>
            </div>

            {myEvents.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <svg className="h-7 w-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">No events yet</h3>
                <p className="mt-1 text-sm text-slate-500">Create your first event to get started.</p>
                <Link href="/dashboard/organizer/create"
                  className="mt-5 inline-block rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Create Event
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {myEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900">{event.title}</h3>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        event.status === "published" ? "bg-green-100 text-green-700"
                        : event.status === "draft" ? "bg-slate-100 text-slate-600"
                        : "bg-red-100 text-red-600"
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-slate-500">
                      <p>{event.date} · {event.location}</p>
                      <p>{event.bookedSeats} / {event.seats} seats booked</p>
                      {/* Seat fill bar */}
                      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                        <div
                          className="h-1.5 rounded-full bg-blue-500"
                          style={{ width: `${Math.min((event.bookedSeats / event.seats) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <Link href={`/events/${event.id}`}
                        className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                        View
                      </Link>
                      <Link href={`/dashboard/organizer/edit/${event.id}`}
                        className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        Edit
                      </Link>
                      <button onClick={() => handleDeleteEvent(event.id)}
                        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ATTENDEE TAB ── */}
        {activeTab === "attendee" && (
          <div>
            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Upcoming Events</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{upcomingBookings.length}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Saved Events</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{savedEvents.length}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-500">Total Bookings</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{bookings.length}</p>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-2">
              {/* Bookings */}
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">My Bookings</h2>
                  <Link href="/dashboard/bookings" className="text-sm font-medium text-blue-600 hover:underline">
                    View all
                  </Link>
                </div>
                {upcomingBookings.length === 0 ? (
                  <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">No upcoming bookings.</p>
                    <Link href="/events" className="mt-4 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-slate-900">{booking.eventTitle}</h3>
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            {booking.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{booking.date} · {booking.location}</p>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/events/${booking.eventId}`}
                            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                            View Event
                          </Link>
                          <Link href="/dashboard/bookings"
                            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            Manage
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved events */}
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Saved Events</h2>
                  <Link href="/events" className="text-sm font-medium text-blue-600 hover:underline">
                    Browse more
                  </Link>
                </div>
                {savedEvents.length === 0 ? (
                  <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">No saved events yet.</p>
                    <Link href="/events" className="mt-4 inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                      Explore Events
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedEvents.map((event) => (
                      <div key={event.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <h3 className="font-semibold text-slate-900">{event.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{event.date} · {event.location}</p>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/events/${event.id}`}
                            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                            View Details
                          </Link>
                          <button onClick={() => handleRemoveSaved(event.id)}
                            className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 rounded-2xl bg-slate-900 p-8 text-center text-white">
              <h2 className="text-xl font-bold">Looking for something new?</h2>
              <p className="mt-1 text-sm text-slate-400">Discover events happening near you.</p>
              <Link href="/events"
                className="mt-5 inline-block rounded-full bg-blue-600 px-7 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                Browse All Events
              </Link>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </main>
  );
}
