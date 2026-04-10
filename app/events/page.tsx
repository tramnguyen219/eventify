"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/app/_utils/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventList from "@/components/EventList";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, orderBy("date", "asc"));
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesCategory = category === "All" || e.category === category;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        e.title?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, category, events]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
        <Navbar />
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-slate-600">Loading events...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Browse Events
          </p>
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Explore upcoming events
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Discover events, workshops, and community activities. Find the right
            event and manage your bookings with ease using Eventify.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="mb-8 space-y-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <SearchBar value={search} onChange={setSearch} />
          <FilterBar selected={category} onChange={setCategory} />
        </div>

        {/* Results count */}
        <p className="mb-6 text-sm text-slate-500">
          {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <EventList events={filtered} />
      </section>

      <Footer />
    </main>
  );
}
