"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import { getOrganizerEvents, deleteEvent } from "@/app/_services/eventService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  seats: number;
  bookedSeats: number;
  status?: string;
  venue?: string;
  description?: string;
  price?: number;
};

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    upcomingEvents: 0,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        
        // Fetch real events from Firestore
        try {
          const userEvents = await getOrganizerEvents(currentUser.uid);
          const typedEvents = userEvents as Event[];
          setEvents(typedEvents);
          
          // Calculate stats
          const totalEvents = typedEvents.length;
          const totalBookings = typedEvents.reduce((sum, event) => sum + (event.bookedSeats || 0), 0);
          const upcomingEvents = typedEvents.filter(event => new Date(event.date) > new Date()).length;
          
          setStats({ totalEvents, totalBookings, upcomingEvents });
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }
    
    setDeletingId(eventId);
    
    try {
      await deleteEvent(eventId);
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      setStats({
        ...stats,
        totalEvents: stats.totalEvents - 1,
      });
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setDeletingId(null);
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

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
              Organizer Dashboard
            </p>
            <h1 className="text-4xl font-bold text-slate-900">Manage your events</h1>
            <p className="mt-3 text-slate-600">
              Welcome back, {user.displayName || user.email?.split('@')[0]}! You have {events.length} event{events.length !== 1 ? 's' : ''}.
            </p>
          </div>

          <Link
            href="/dashboard/organizer/create"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700"
          >
            + Create Event
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">Total Events</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{stats.totalEvents}</h2>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">Total Bookings</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{stats.totalBookings}</h2>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
            <p className="text-sm text-slate-500">Upcoming Events</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">{stats.upcomingEvents}</h2>
          </div>
        </div>

        {/* Events List */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Your Events</h2>

          {events.length === 0 ? (
            <div className="rounded-[28px] bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No events yet</h3>
              <p className="mt-2 text-slate-600">Create your first event to get started.</p>
              <Link
                href="/dashboard/organizer/create"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Create Event
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">{event.title}</h3>
                    {event.status && (
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        event.status === "published" 
                          ? "bg-green-100 text-green-700"
                          : event.status === "draft"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {event.bookedSeats || 0} / {event.seats} seats booked
                    </p>
                    {event.price && (
                      <p className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${event.price} per ticket
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/events/${event.id}`}
                      className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700"
                    >
                      View Event
                    </Link>
                    <Link
                      href={`/dashboard/organizer/edit/${event.id}`}
                      className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deletingId === event.id}
                      className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === event.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}