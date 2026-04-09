import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bookings = [
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

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12 text-slate-800">
      <Navbar />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            My Bookings
          </p>
          <h1 className="text-4xl font-bold text-slate-900">Manage your bookings</h1>
          <p className="mt-3 text-slate-600">
            View your registered events and manage your event attendance.
          </p>
        </div>

        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {booking.title}
                  </h2>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    <p>{booking.date}</p>
                    <p>{booking.location}</p>
                    <p>Status: {booking.status}</p>
                  </div>
                </div>

                <button className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </main>
  );
}