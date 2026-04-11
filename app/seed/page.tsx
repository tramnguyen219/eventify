"use client";

import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/app/_utils/firebase";

const SAMPLE_EVENTS = [
  {
    title: "Future Innovators Summit",
    category: "Technology",
    date: "2026-04-18",
    time: "10:00 AM",
    location: "Calgary, AB",
    seats: 120,
    bookedSeats: 0,
    price: 49.99,
    description: "A technology conference focused on innovation, software, and future trends. Join industry leaders, developers, and students for a full day of talks, demos, and networking.",
    imageUrl: "",
    status: "published",
  },
  {
    title: "Creative Design Workshop",
    category: "Design",
    date: "2026-04-22",
    time: "1:00 PM",
    location: "Edmonton, AB",
    seats: 40,
    bookedSeats: 0,
    price: 0,
    description: "A hands-on workshop for students and professionals interested in UI/UX design, branding, and digital creativity. Bring your laptop and leave with a new project.",
    imageUrl: "",
    status: "published",
  },
  {
    title: "Business Networking Night",
    category: "Business",
    date: "2026-05-02",
    time: "6:00 PM",
    location: "Calgary, AB",
    seats: 75,
    bookedSeats: 0,
    price: 25,
    description: "Connect with professionals, entrepreneurs, and students in the business community. Guided networking sessions, guest speakers, and light refreshments included.",
    imageUrl: "",
    status: "published",
  },
  {
    title: "Community Volunteer Fair",
    category: "Community",
    date: "2026-05-10",
    time: "9:00 AM",
    location: "Red Deer, AB",
    seats: 60,
    bookedSeats: 0,
    price: 0,
    description: "Discover volunteer opportunities and connect with local non-profits and community organizations. Open to everyone — bring friends and family.",
    imageUrl: "",
    status: "published",
  },
  {
    title: "Student Career Expo",
    category: "Career",
    date: "2026-05-15",
    time: "10:00 AM",
    location: "Calgary, AB",
    seats: 200,
    bookedSeats: 0,
    price: 0,
    description: "Meet employers, learn about job opportunities, and explore career paths. Resume reviews and mock interviews available on-site.",
    imageUrl: "",
    status: "published",
  },
  {
    title: "Music and Arts Festival",
    category: "Entertainment",
    date: "2026-05-20",
    time: "12:00 PM",
    location: "Banff, AB",
    seats: 150,
    bookedSeats: 0,
    price: 35,
    description: "Enjoy live music performances, art installations, food vendors, and a full day of entertainment in the heart of Banff. Family-friendly event.",
    imageUrl: "",
    status: "published",
  },
  {
    title: "AI & Machine Learning Bootcamp",
    category: "Technology",
    date: "2026-06-01",
    time: "9:00 AM",
    location: "Calgary, AB",
    seats: 50,
    bookedSeats: 0,
    price: 79.99,
    description: "An intensive one-day bootcamp covering the fundamentals of AI and machine learning. Hands-on exercises using Python. Beginner-friendly.",
    imageUrl: "",
    status: "published",
  },
  {
    title: "Startup Pitch Night",
    category: "Business",
    date: "2026-06-05",
    time: "5:30 PM",
    location: "Edmonton, AB",
    seats: 80,
    bookedSeats: 0,
    price: 15,
    description: "Watch early-stage startups pitch their ideas to a panel of investors and mentors. Great for entrepreneurs, investors, and anyone interested in the startup ecosystem.",
    imageUrl: "",
    status: "published",
  },
  {
    title: "Photography for Beginners",
    category: "Design",
    date: "2026-06-12",
    time: "2:00 PM",
    location: "Calgary, AB",
    seats: 25,
    bookedSeats: 0,
    price: 20,
    description: "Learn the basics of photography — composition, lighting, and editing — in this beginner-friendly workshop. DSLR or smartphone welcome.",
    imageUrl: "",
    status: "published",
  },
  {
    title: "Summer Block Party",
    category: "Community",
    date: "2026-06-20",
    time: "11:00 AM",
    location: "Lethbridge, AB",
    seats: 300,
    bookedSeats: 0,
    price: 0,
    description: "A free community celebration with food, games, live music, and activities for all ages. Come out and meet your neighbours!",
    imageUrl: "",
    status: "published",
  },
];

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [log, setLog] = useState<string[]>([]);

  const handleSeed = async () => {
    setStatus("loading");
    setLog([]);

    try {
      const eventsRef = collection(db, "events");
      for (const event of SAMPLE_EVENTS) {
        await addDoc(eventsRef, {
          ...event,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        setLog((prev) => [...prev, `✓ Added: ${event.title}`]);
      }
      setStatus("done");
    } catch (err: any) {
      console.error(err);
      setLog((prev) => [...prev, `✗ Error: ${err.message}`]);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-slate-900">Seed Events</h1>
        <p className="mt-2 text-slate-500">
          Adds {SAMPLE_EVENTS.length} sample events to Firestore. Make sure you are logged in first.
        </p>

        <button
          onClick={handleSeed}
          disabled={status === "loading" || status === "done"}
          className="mt-8 rounded-full bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading"
            ? "Adding events..."
            : status === "done"
            ? "Done!"
            : "Add Sample Events"}
        </button>

        {log.length > 0 && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <ul className="space-y-2 text-sm">
              {log.map((line, i) => (
                <li
                  key={i}
                  className={line.startsWith("✓") ? "text-green-600" : "text-red-600"}
                >
                  {line}
                </li>
              ))}
            </ul>
            {status === "done" && (
              <p className="mt-4 font-semibold text-slate-900">
                All events added! You can now{" "}
                <a href="/events" className="text-blue-600 hover:underline">
                  browse events
                </a>
                .
              </p>
            )}
          </div>
        )}

        {status === "error" && (
          <p className="mt-4 text-sm text-red-600">
            Failed — make sure you are logged in and Firestore rules allow writes.
          </p>
        )}
      </div>
    </main>
  );
}
