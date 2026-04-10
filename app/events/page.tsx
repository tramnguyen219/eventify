"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventList from "@/components/EventList";
import FilterBar from "@/components/FilterBar";
import SearchBar from "@/components/SearchBar";

// TODO (groupmate): replace with getEvents() from Firestore
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Future Innovators Summit",
    category: "Technology",
    date: "April 18, 2026",
    time: "10:00 AM",
    location: "Calgary, AB",
    totalSeats: 120,
    bookedSeats: 45,
    price: 49.99,
    description: "A technology event focused on innovation, software, and future trends.",
  },
  {
    id: 2,
    title: "Creative Design Workshop",
    category: "Design",
    date: "April 22, 2026",
    time: "1:00 PM",
    location: "Edmonton, AB",
    totalSeats: 40,
    bookedSeats: 0,
    price: 0,
    description: "A hands-on workshop for students interested in design and creativity.",
  },
  {
    id: 3,
    title: "Business Networking Night",
    category: "Business",
    date: "May 2, 2026",
    time: "6:00 PM",
    location: "Calgary, AB",
    totalSeats: 75,
    bookedSeats: 10,
    price: 25,
    description: "Connect with professionals, entrepreneurs, and students in business.",
  },
  {
    id: 4,
    title: "Community Volunteer Fair",
    category: "Community",
    date: "May 10, 2026",
    time: "9:00 AM",
    location: "Red Deer, AB",
    totalSeats: 60,
    bookedSeats: 60,
    price: 0,
    description: "Discover volunteer opportunities and connect with local organizations.",
  },
  {
    id: 5,
    title: "Student Career Expo",
    category: "Career",
    date: "May 15, 2026",
    time: "10:00 AM",
    location: "Calgary, AB",
    totalSeats: 200,
    bookedSeats: 8,
    price: 0,
    description: "Meet employers, learn about opportunities, and explore career paths.",
  },
  {
    id: 6,
    title: "Music and Arts Festival",
    category: "Entertainment",
    date: "May 20, 2026",
    time: "12:00 PM",
    location: "Banff, AB",
    totalSeats: 150,
    bookedSeats: 30,
    price: 35,
    description: "Enjoy live performances, art displays, and a full day of entertainment.",
  },
];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return MOCK_EVENTS.filter((e) => {
      const matchesCategory = category === "All" || e.category === category;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

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
            Discover events, workshops, and community activities. Find the right event
            and manage your bookings with ease using Eventify.
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

        <EventList events={filtered} />
      </section>

      <Footer />
    </main>
  );
}
