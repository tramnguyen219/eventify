"use client";

import Link from "next/link";
import { use } from "react";

export default function BookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-slate-900">Eventify</Link>
        </nav>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h1>
          <p className="mt-3 text-slate-600">
            Your booking has been successfully submitted. You will receive a confirmation email shortly.
          </p>

          <div className="mt-8 rounded-xl bg-slate-50 p-5 text-left">
            <h2 className="mb-3 font-semibold text-slate-900">What&apos;s next?</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Check your email for a booking confirmation
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Your ticket will be available in your dashboard
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600">✓</span>
                Bring your confirmation to the event
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard/bookings"
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              View My Bookings
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse More Events
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
