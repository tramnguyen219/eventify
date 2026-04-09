import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Dashboard
          </p>
          <h1 className="text-4xl font-bold text-slate-900">Choose your dashboard</h1>
          <p className="mt-3 text-slate-600">
            Access the tools you need based on your role in Eventify.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Organizer Dashboard</h2>
            <p className="mt-3 text-slate-600">
              Create events, manage listings, and track bookings.
            </p>
            <Link
              href="/dashboard/organizer"
              className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Go to Organizer Dashboard
            </Link>
          </div>

          <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">Attendee Dashboard</h2>
            <p className="mt-3 text-slate-600">
              View bookings, saved events, and upcoming registrations.
            </p>
            <Link
              href="/dashboard/attendee"
              className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Go to Attendee Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}