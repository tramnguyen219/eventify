import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const upcomingEvents = [
  {
    id: 1,
    title: "Future Innovators Summit",
    date: "April 18, 2026",
    location: "Calgary, AB",
    status: "Confirmed",
  },
  {
    id: 2,
    title: "Business Networking Night",
    date: "May 2, 2026",
    location: "Calgary, AB",
    status: "Confirmed",
  },
];

const savedEvents = [
  {
    id: 3,
    title: "Creative Design Workshop",
    date: "April 22, 2026",
    location: "Edmonton, AB",
  },
  {
    id: 4,
    title: "Student Career Expo",
    date: "May 15, 2026",
    location: "Calgary, AB",
  },
];

export default function AttendeeDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Attendee Dashboard
          </p>
          <h1 className="text-4xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-3 text-slate-600">
            View your upcoming events, saved events, and bookings in one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Upcoming Events</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">2</h2>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Saved Events</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">2</h2>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Active Bookings</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">2</h2>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Upcoming Events</h2>

            <div className="grid gap-5">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200"
                >
                  <h3 className="text-2xl font-bold text-slate-900">{event.title}</h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>{event.date}</p>
                    <p>{event.location}</p>
                    <p>Status: {event.status}</p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/events/${event.id}`}
                      className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      View Event
                    </Link>

                    <Link
                      href="/dashboard/bookings"
                      className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Manage Booking
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Saved Events</h2>

            <div className="grid gap-5">
              {savedEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200"
                >
                  <h3 className="text-2xl font-bold text-slate-900">{event.title}</h3>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>{event.date}</p>
                    <p>{event.location}</p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/events/${event.id}`}
                      className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      View Details
                    </Link>

                    <button className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}