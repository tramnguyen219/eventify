export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 shadow-sm">
        <h1 className="text-xl font-bold">Eventify</h1>
        <div className="space-x-4">
          <a href="/events" className="hover:underline">Events</a>
          <a href="/login" className="hover:underline">Login</a>
          <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl font-bold mb-4">
          Discover and Manage Events Easily
        </h2>
        <p className="text-lg mb-6">
          Eventify helps you find events, book tickets, and manage everything in one place.
        </p>
        <div className="space-x-4">
          <a href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded">
            Get Started
          </a>
          <a href="/events" className="border px-6 py-3 rounded">
            Browse Events
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p>Browse events and book your spot quickly and easily.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Organizer Tools</h3>
            <p>Create and manage events with a simple dashboard.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">All in One Place</h3>
            <p>Manage your bookings and events in one platform.</p>
          </div>

        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 px-6 bg-blue-600 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">
          Ready to get started?
        </h3>
        <p className="mb-6">
          Join Eventify and start exploring events today.
        </p>
        <a href="/signup" className="bg-white text-blue-600 px-6 py-3 rounded">
          Sign Up Now
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 text-sm text-gray-500">
        Eventify © 2026. All rights reserved.
      </footer>

    </main>
  );
}