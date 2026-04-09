import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const organizerEvents = [
  {
    id: 1,
    title: "Future Innovators Summit",
    date: "April 18, 2026",
    location: "Calgary, AB",
    seats: 120,
  },
  {
    id: 2,
    title: "Creative Design Workshop",
    date: "April 22, 2026",
    location: "Edmonton, AB",
    seats: 40,
  },
];

export default function OrganizerDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12 text-slate-800">
      <Navbar />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
              Organizer Dashboard
            </p>
            <h1 className="text-4xl font-bold text-slate-900">Manage your events</h1>
            <p className="mt-3 text-slate-600">
              View your events, manage details, and create new event listings.
            </p>
          </div>

          <Link
            href="/dashboard/organizer/create"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Create Event
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total Events</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">2</h2>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total Bookings</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">160</h2>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Upcoming Events</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">2</h2>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Your Events</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {organizerEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <h3 className="text-2xl font-bold text-slate-900">{event.title}</h3>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>{event.date}</p>
                  <p>{event.location}</p>
                  <p>{event.seats} seats available</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/events/${event.id}`}
                    className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View
                  </Link>

                  <Link
                    href={`/dashboard/organizer/edit/${event.id}`}
                    className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </main>
  );
}