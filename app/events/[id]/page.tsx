"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import { getEventById, createBooking } from "@/app/_services/eventService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCategoryImage } from "@/lib/categoryImages";

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
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    const availableSeats = event.seats - (event.bookedSeats || 0);
    if (tickets > availableSeats) {
      setError(`Only ${availableSeats} seat${availableSeats !== 1 ? "s" : ""} available`);
      return;
    }

    setBooking(true);
    setError("");

    try {
      await createBooking(
        {
          tickets,
          totalAmount: tickets * (event.price || 0),
          eventTitle: event.title,
          eventDate: event.date,
          location: event.location,
        },
        user.uid,
        eventId
      );
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
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
        <Footer />
      </main>
    );
  }

  if (error && !event) {
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

  const availableSeats = (event.seats ?? event.totalSeats ?? 0) - (event.bookedSeats || 0);
  const isSoldOut = availableSeats <= 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← Back to Events
        </button>

        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-slate-200">
          {/* Poster image — event-specific or category fallback */}
          <div className="relative h-72 w-full bg-gradient-to-r from-blue-600 to-slate-900">
            <Image
              src={event.imageUrl ?? getCategoryImage(event.category)}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="grid gap-10 p-8 md:grid-cols-[2fr_1fr]">
            {/* Left: details */}
            <div>
              <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
                {event.category}
              </p>
              <h1 className="text-4xl font-bold text-slate-900">{event.title}</h1>
              <p className="mt-5 leading-8 text-slate-600">{event.description}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Date</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{event.date}</p>
                </div>
                {event.time && (
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-500">Time</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{event.time}</p>
                  </div>
                )}
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Location</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{event.location}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Available Seats</p>
                  <p className={`mt-2 text-lg font-semibold ${isSoldOut ? "text-red-600" : "text-slate-900"}`}>
                    {isSoldOut ? "Sold Out" : `${availableSeats} of ${event.seats ?? event.totalSeats}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: booking card */}
            <div>
              <div className="sticky top-24 rounded-[28px] bg-slate-900 p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold">Book this event</h2>
                <p className="mt-2 text-2xl font-bold text-blue-400">
                  {event.price === 0 ? "Free" : `$${Number(event.price).toFixed(2)}`}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Reserve your spot and manage your booking through Eventify.
                </p>

                {!isSoldOut && (
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Number of Tickets
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setTickets(Math.max(1, tickets - 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 text-white hover:bg-white/10"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={tickets}
                        onChange={(e) =>
                          setTickets(
                            Math.min(availableSeats, Math.max(1, parseInt(e.target.value) || 1))
                          )
                        }
                        className="w-16 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-center text-white"
                        min="1"
                        max={availableSeats}
                      />
                      <button
                        onClick={() => setTickets(Math.min(availableSeats, tickets + 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 text-white hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>
                    {event.price > 0 && (
                      <p className="mt-3 text-sm text-slate-300">
                        Total:{" "}
                        <span className="font-bold text-white">
                          ${(tickets * event.price).toFixed(2)}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-lg bg-red-900/40 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={isSoldOut || booking}
                  className="mt-6 w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {booking ? "Processing..." : isSoldOut ? "Sold Out" : "Book Now"}
                </button>

                {!user && (
                  <p className="mt-3 text-center text-xs text-slate-400">
                    You&apos;ll be asked to log in to complete your booking.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
