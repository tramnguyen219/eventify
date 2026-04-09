"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
          Eventify
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-blue-600">
            Home
          </Link>
          <Link href="/events" className="text-sm font-medium hover:text-blue-600">
            Events
          </Link>
          
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border-2 border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white p-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="text-sm font-medium hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/events" 
              className="text-sm font-medium hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="text-sm font-medium hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="block rounded-full border-2 border-blue-600 px-4 py-2 text-center text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/signup" 
                      className="block rounded-full bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition-all hover:bg-blue-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}