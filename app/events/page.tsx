import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const events = [
  {
    id: 1,
    title: "Future Innovators Summit",
    category: "Technology",
    date: "April 18, 2026",
    location: "Calgary, AB",
    seats: 120,
    description: "A technology event focused on innovation, software, and future trends.",
  },
  {
    id: 2,
    title: "Creative Design Workshop",
    category: "Design",
    date: "April 22, 2026",
    location: "Edmonton, AB",
    seats: 40,
    description: "A hands-on workshop for students interested in design and creativity.",
  },
  {
    id: 3,
    title: "Business Networking Night",
    category: "Business",
    date: "May 2, 2026",
    location: "Calgary, AB",
    seats: 75,
    description: "Connect with professionals, entrepreneurs, and students in business.",
  },
  {
    id: 4,
    title: "Community Volunteer Fair",
    category: "Community",
    date: "May 10, 2026",
    location: "Red Deer, AB",
    seats: 60,
    description: "Discover volunteer opportunities and connect with local organizations.",
  },
  {
    id: 5,
    title: "Student Career Expo",
    category: "Career",
    date: "May 15, 2026",
    location: "Calgary, AB",
    seats: 200,
    description: "Meet employers, learn about opportunities, and explore career paths.",
  },
  {
    id: 6,
    title: "Music and Arts Festival",
    category: "Entertainment",
    date: "May 20, 2026",
    location: "Banff, AB",
    seats: 150,
    description: "Enjoy live performances, art displays, and a full day of entertainment.",
  },
];

export default function EventsPage() {
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

        <div className="mb-8 grid gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search
            </label>
            <input
              type="text"
              placeholder="Search events"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <option>All Categories</option>
              <option>Technology</option>
              <option>Design</option>
              <option>Business</option>
              <option>Community</option>
              <option>Career</option>
              <option>Entertainment</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Location
            </label>
            <select className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <option>All Locations</option>
              <option>Calgary, AB</option>
              <option>Edmonton, AB</option>
              <option>Red Deer, AB</option>
              <option>Banff, AB</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-44 bg-gradient-to-r from-blue-600 to-slate-900" />

              <div className="p-6">
                <p className="mb-2 text-sm font-medium text-blue-600">{event.category}</p>
                <h2 className="text-2xl font-bold text-slate-900">{event.title}</h2>
                <p className="mt-3 text-sm text-slate-600">{event.description}</p>

                <div className="mt-5 space-y-2 text-sm text-slate-500">
                  <p>{event.date}</p>
                  <p>{event.location}</p>
                  <p>{event.seats} seats available</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/events/${event.id}`}
                    className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View Details
                  </Link>

                  <button className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Book Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}