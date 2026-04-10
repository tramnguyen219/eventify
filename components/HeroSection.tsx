"use client";

import Link from "next/link";

type HeroSectionProps = {
  userName?: string | null;
};

export default function HeroSection({ userName }: HeroSectionProps) {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
      <div>
        <p className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
          Event Booking Made Simple
        </p>
        <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
          Discover, create, and manage events with ease.
        </h1>
        <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600">
          Eventify is a web-based event booking platform that helps organizers create and
          manage events while allowing attendees to easily browse, register, and manage
          their bookings all in one place.
        </p>
        <div className="flex flex-wrap gap-4">
          {userName ? (
            <>
              <div className="rounded-lg bg-white px-6 py-3 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm text-slate-600">
                  Welcome back,{" "}
                  <span className="font-semibold text-slate-900">{userName}</span>
                </p>
              </div>
              <Link
                href="/dashboard"
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                href="/events"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Browse Events
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Upcoming Event</h2>
          <div className="rounded-2xl bg-slate-100 p-5">
            <p className="text-sm font-medium text-blue-600">Tech Conference</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Future Innovators Summit
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              April 18, 2026 · Calgary · 75 seats available
            </p>
            <Link
              href="/events/1"
              className="mt-5 inline-block rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View Details
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold">For Organizers</h3>
            <p className="mt-2 text-sm text-blue-100">
              Create, edit, and manage events in one dashboard.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold">For Attendees</h3>
            <p className="mt-2 text-sm text-slate-300">
              Find events, register quickly, and manage your bookings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
