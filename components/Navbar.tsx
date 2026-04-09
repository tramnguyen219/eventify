import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-slate-900">
          Eventify
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-blue-600">
            Home
          </Link>

          <Link href="/events" className="text-sm font-medium hover:text-blue-600">
            Events
          </Link>

          <Link
            href="/dashboard/organizer"
            className="text-sm font-medium hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link href="/login" className="text-sm font-medium hover:text-blue-600">
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}