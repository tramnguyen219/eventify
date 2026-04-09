import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const events = [
  {
    id: "1",
    title: "Future Innovators Summit",
    category: "Technology",
    date: "April 18, 2026",
    time: "10:00 AM",
    location: "Calgary, AB",
    seats: 120,
    description:
      "A technology event focused on innovation, software, and future trends. This event brings together students, professionals, and industry speakers for a full day of learning and networking.",
  },
  {
    id: "2",
    title: "Creative Design Workshop",
    category: "Design",
    date: "April 22, 2026",
    time: "1:00 PM",
    location: "Edmonton, AB",
    seats: 40,
    description:
      "A hands-on workshop for students interested in design, creativity, and digital experiences.",
  },
  {
    id: "3",
    title: "Business Networking Night",
    category: "Business",
    date: "May 2, 2026",
    time: "6:00 PM",
    location: "Calgary, AB",
    seats: 75,
    description:
      "Connect with professionals, entrepreneurs, and students in business through guided networking and speaker sessions.",
  },
];

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = events.find((item) => item.id === id);

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <section className="px-6 py-16">
          <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <h1 className="text-3xl font-bold text-slate-900">Event not found</h1>
            <p className="mt-4 text-slate-600">
              The event you are looking for does not exist.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back to Events
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/events"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Events
        </Link>

        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-slate-200">
          <div className="h-64 bg-gradient-to-r from-blue-600 to-slate-900" />

          <div className="grid gap-10 p-8 md:grid-cols-[2fr_1fr]">
            <div>
              <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
                {event.category}
              </p>

              <h1 className="text-4xl font-bold text-slate-900">{event.title}</h1>

              <p className="mt-5 leading-8 text-slate-600">{event.description}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Date</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {event.date}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Time</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {event.time}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">Location</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {event.location}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Available Seats
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {event.seats}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-[28px] bg-slate-900 p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold">Book this event</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Reserve your spot and manage your booking through Eventify.
                </p>

                <button className="mt-6 w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  Book Now
                </button>

                <button className="mt-3 w-full rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  Save for Later
                </button>
              </div>

              <div className="mt-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Event Location
                </h3>
                <div className="mt-4 flex h-40 items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">
                  Map preview placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}