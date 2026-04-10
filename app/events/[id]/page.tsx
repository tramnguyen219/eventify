"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import { getEventById, createBooking } from "@/app/_services/eventService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState(1);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Event not found");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [eventId]);

  const handleBooking = async () => {
    if (!user) {
      if (confirm("Please login to book tickets. Go to login page?")) {
        router.push("/login");
      }
      return;
    }

    const availableSeats = event.seats - (event.bookedSeats || 0);
    if (tickets > availableSeats) {
      alert(`Only ${availableSeats} seats available`);
      return;
    }

    setBooking(true);
    setError("");

    try {
      await createBooking(
        {
          tickets: tickets,
          totalAmount: tickets * event.price,
          eventTitle: event.title,
          eventDate: event.date,
          location: event.location,
        },
        user.uid,
        eventId
      );
      
      alert(`Successfully booked ${tickets} ticket(s)!`);
      router.push("/dashboard/attendee");
    } catch (err) {
      setError("Failed to book tickets. Please try again.");
      console.error(err);
    } finally {
      setBooking(false);
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

  if (error || !event) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {error || "Event not found"}
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const availableSeats = event.seats - (event.bookedSeats || 0);
  const isSoldOut = availableSeats <= 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-6 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="h-64 rounded-2xl bg-gradient-to-r from-blue-600 to-slate-900" />
            
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-blue-600">{event.category}</p>
              <h1 className="text-4xl font-bold text-slate-900">{event.title}</h1>
              <p className="mt-4 text-slate-600">{event.description}</p>
              
              <div className="mt-6 space-y-3">
                <h2 className="text-xl font-bold text-slate-900">Event Details</h2>
                <div className="grid gap-4 rounded-2xl bg-slate-50 p-6">
                  <p className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date}
                  </p>
                  <p className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.venue}, {event.location}
                  </p>
                  <p className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.price === 0 ? "Free" : `$${event.price} per ticket`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <h3 className="text-xl font-bold text-slate-900">Book Tickets</h3>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Available Seats</span>
                  <span className="font-semibold text-slate-900">{availableSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Price per Ticket</span>
                  <span className="font-semibold text-slate-900">
                    {event.price === 0 ? "Free" : `$${event.price}`}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Number of Tickets
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTickets(Math.max(1, tickets - 1))}
                      className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={tickets}
                      onChange={(e) => setTickets(Math.min(availableSeats, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center"
                      min="1"
                      max={availableSeats}
                    />
                    <button
                      onClick={() => setTickets(Math.min(availableSeats, tickets + 1))}
                      className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {event.price === 0 ? "Free" : `$${tickets * event.price}`}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={isSoldOut || booking}
                className="mt-6 w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                {booking ? "Processing..." : isSoldOut ? "Sold Out" : "Book Now"}
              </button>

              {!user && (
                <p className="mt-4 text-center text-sm text-slate-500">
                  Please login to book tickets
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}