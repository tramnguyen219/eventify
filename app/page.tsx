import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Event Booking Made Simple
          </p>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
            Discover, create, and manage events with ease.
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-8 text-slate-600">
            Eventify is a web-based event booking platform that helps organizers create
            and manage events while allowing attendees to easily browse, register, and
            manage their bookings all in one place.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Browse Events
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Upcoming Event</h2>
            <div className="rounded-2xl bg-slate-100 p-5">
              <p className="text-sm font-medium text-blue-600">Tech Conference</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Future Innovators Summit</h3>
              <p className="mt-3 text-sm text-slate-600">
                April 18, 2026 • Calgary • 120 seats available
              </p>
              <Link
                href="/events/1"
                className="mt-5 inline-block rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                View Details
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold">For Organizers</h3>
              <p className="mt-2 text-sm text-blue-100">
                Create, edit, and manage events in one dashboard.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold">For Attendees</h3>
              <p className="mt-2 text-sm text-slate-300">
                Find events, register quickly, and manage your bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Why choose Eventify?</h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything needed for organizing and attending events in one platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <h3 className="mb-3 text-xl font-semibold text-slate-900">Easy Booking</h3>
              <p className="text-slate-600">
                Users can browse events and register in a simple and organized way.
              </p>
            </article>

            <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <h3 className="mb-3 text-xl font-semibold text-slate-900">Organizer Tools</h3>
              <p className="text-slate-600">
                Organizers can create, update, and manage events using one dashboard.
              </p>
            </article>

            <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
              <h3 className="mb-3 text-xl font-semibold text-slate-900">Responsive Design</h3>
              <p className="text-slate-600">
                The platform is designed to work well on both desktop and mobile devices.
              </p>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}