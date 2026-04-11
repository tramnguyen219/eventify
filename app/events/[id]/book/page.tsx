"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookTicket from "@/components/bookticket";

export default function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
            Eventify
          </Link>
          <Link href={`/events/${id}`} className="text-sm font-medium text-slate-600 hover:text-blue-600">
            ← Back to Event
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <BookTicket eventId={id} />
      </div>

      <Footer />
    </main>
  );
}
