"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditEventForm from "@/components/EditEventForm";

type EventData = {
  id: string;
  title: string;
  date: string;
  location: string;
  venue: string;
  description: string;
  seats: number;
  price: number;
  imageUrl: string;
  category: string;
};

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string; // This gets the ID from the URL
  
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [event, setEvent] = useState<EventData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      
      setIsAuthenticated(true);
      
      try {
        // TODO: Fetch event from Firebase/Firestore using eventId
        // For now, using mock data based on the ID
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
        
        // Mock data - in reality, you'd fetch this from Firebase
        const mockEvent: EventData = {
          id: eventId,
          title: eventId === "1" ? "Future Innovators Summit" : "Creative Design Workshop",
          date: "2026-04-18",
          location: "Calgary, AB",
          venue: "Telus Convention Centre",
          description: "Join us for an exciting summit about future technologies, innovation, and networking opportunities with industry leaders.",
          seats: 120,
          price: 60,
          imageUrl: "",
          category: "Conference",
        };
        
        setEvent(mockEvent);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, eventId]);

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

  if (!isAuthenticated) return null;

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Link
              href="/dashboard/organizer"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!event) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <Link href="/dashboard/organizer" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Edit Event</h1>
          <p className="mt-2 text-slate-600">Update your event details below.</p>
        </div>

        <EditEventForm event={event} />
      </div>

      <Footer />
    </main>
  );
}