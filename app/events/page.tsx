"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/app/_utils/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Event = {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  seats: number;
  bookedSeats?: number;
  description: string;
  price?: number;
  venue?: string;
  organizerName?: string;
};

// Static categories from your original code
const CATEGORIES = [
  "All Categories",
  "Technology",
  "Design", 
  "Business",
  "Community",
  "Career",
  "Entertainment"
];

// Static locations from your original code
const LOCATIONS = [
  "All Locations",
  "Calgary, AB",
  "Edmonton, AB",
  "Red Deer, AB",
  "Banff, AB"
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, selectedCategory, selectedLocation, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, orderBy("date", "asc"));
      const querySnapshot = await getDocs(q);
      
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter - using static categories
    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    // Location filter - using static locations
    if (selectedLocation && selectedLocation !== "All Locations") {
      filtered = filtered.filter(event => event.location === selectedLocation);
    }
    
    setFilteredEvents(filtered);
  };

  const getAvailableSeats = (event: Event) => {
    return event.seats - (event.bookedSeats || 0);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
        <Navbar />
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
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
            Discover events, workshops, and community activities. Find the right event
            and manage your bookings with ease using Eventify.
          </p>
        </div>

        {/* Filters with static categories and locations */}
        <div className="mb-8 grid gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search
            </label>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-slate-500">
          Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="rounded-[28px] bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No events found</h3>
            <p className="mt-2 text-slate-600">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
                setSelectedLocation("All Locations");
              }}
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => {
              const availableSeats = getAvailableSeats(event);
              const isSoldOut = availableSeats <= 0;
              
              return (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-44 bg-gradient-to-r from-blue-600 to-slate-900">
                    {isSoldOut && (
                      <div className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                        Sold Out
                      </div>
                    )}
                    {event.price && event.price > 0 && (
                      <div className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                        ${event.price}
                      </div>
                    )}
                    {(!event.price || event.price === 0) && (
                      <div className="absolute left-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                        Free
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="mb-2 text-sm font-medium text-blue-600">{event.category}</p>
                    <h2 className="text-2xl font-bold text-slate-900">{event.title}</h2>
                    <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-2 text-sm text-slate-500">
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
                        {availableSeats} / {event.seats} seats available
                      </p>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Link
                        href={`/events/${event.id}`}
                        className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700"
                      >
                        View Details
                      </Link>

                      <Link
                        href={`/events/${event.id}?book=true`}
                        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                          isSoldOut
                            ? "cursor-not-allowed bg-slate-200 text-slate-500"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                        onClick={(e) => {
                          if (isSoldOut) {
                            e.preventDefault();
                            alert("This event is sold out!");
                          }
                        }}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}