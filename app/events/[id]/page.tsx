"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import { getEventById } from "@/app/_services/eventService";
import { getCategoryImage } from "@/lib/categoryImages";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getEventById(eventId)
      .then((data: any) => {
        if (!data) setError("Event not found.");
        else setEvent(data);
      })
      .catch(() => setError("Failed to load event."))
      .finally(() => setLoading(false));

    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, [eventId]);

  const handleBookNow = () => {
    if (!user) {
      router.push(`/login?redirect=/events/${eventId}/book`);
      return;
    }
    router.push(`/events/${eventId}/book`);
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

  const availableSeats = (event.seats ?? event.totalSeats ?? 0) - (event.bookedSeats || 0);
  const isSoldOut = availableSeats <= 0;
  const isFree = !event.price || event.price === 0;

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
            <div className="relative h-64 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-slate-900">
              <Image
                src={event.imageUrl || getCategoryImage(event.category)}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-blue-600">{event.category}</p>
              <h1 className="text-4xl font-bold text-slate-900">{event.title}</h1>
              <p className="mt-4 text-slate-600">{event.description}</p>

              <div className="mt-6">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Event Details</h2>
                <div className="grid gap-4 rounded-2xl bg-slate-50 p-6">
                  <p className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date}{event.time ? ` · ${event.time}` : ""}
                  </p>
                  <p className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue ? `${event.venue}, ${event.location}` : event.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 hover:underline"
                    >
                      {event.venue ? `${event.venue}, ${event.location}` : event.location}
                    </a>
                  </p>
                  <p className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                    </svg>
                    {isSoldOut ? "Sold out" : `${availableSeats} seats available`}
                  </p>
                  <p className="flex items-center gap-3 text-sm text-slate-700">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isFree ? "Free" : `$${Number(event.price).toFixed(2)} per ticket`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-[28px] bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <p className="text-2xl font-bold text-slate-900">
                {isFree ? "Free" : `$${Number(event.price).toFixed(2)}`}
              </p>
              {!isFree && (
                <p className="text-sm text-slate-500">per ticket</p>
              )}

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Date</span>
                  <span className="font-medium text-slate-900">{event.date}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Available</span>
                  <span className={`font-medium ${isSoldOut ? "text-red-600" : "text-slate-900"}`}>
                    {isSoldOut ? "Sold Out" : `${availableSeats} seats`}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={isSoldOut}
                className="mt-6 w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSoldOut ? "Sold Out" : isFree ? "Register for Free" : "Book Now"}
              </button>

              {!user && !isSoldOut && (
                <p className="mt-3 text-center text-xs text-slate-400">
                  You&apos;ll be asked to log in to continue
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
