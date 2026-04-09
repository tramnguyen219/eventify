"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

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

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user.displayName || user.email?.split('@')[0]}!
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your events, track bookings, and more from your dashboard.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Attendee Dashboard Card */}
          <Link href="/dashboard/attendee" className="group">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
              <div className="mb-4 inline-block rounded-full bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">My Profile</h2>
              <p className="mt-2 text-sm text-slate-600">
                View and manage your profile information and preferences.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-blue-600 group-hover:underline">
                View Profile →
              </span>
            </div>
          </Link>

          {/* Bookings Dashboard Card */}
          <Link href="/dashboard/bookings" className="group">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
              <div className="mb-4 inline-block rounded-full bg-blue-100 p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">My Bookings</h2>
              <p className="mt-2 text-sm text-slate-600">
                View and manage all your event registrations and tickets.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-blue-600 group-hover:underline">
                View Bookings →
              </span>
            </div>
          </Link>

          {/* Organizer Dashboard Card */}
          <Link href="/dashboard/organizer" className="group">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
              <div className="mb-4 inline-block rounded-full bg-purple-100 p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Organizer Hub</h2>
              <p className="mt-2 text-sm text-slate-600">
                Create and manage events, track attendees, and analyze sales.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-blue-600 group-hover:underline">
                Manage Events →
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Stats or Recent Activity */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-semibold text-slate-900">Recent Events</h3>
              <p className="mt-2 text-sm text-slate-600">
                No upcoming events yet. Start exploring!
              </p>
              <Link
                href="/events"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Browse Events →
              </Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-semibold text-slate-900">Tip of the Day</h3>
              <p className="mt-2 text-sm text-slate-600">
                Create engaging event pages with high-quality images and detailed descriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}