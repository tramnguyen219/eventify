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
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
      setIsProfileOpen(false);
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
          <Link href="/" className="text-sm font-medium text-slate-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/events" className="text-sm font-medium text-slate-700 hover:text-blue-600">
            Events
          </Link>
          
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                  
                  {/* Profile Dropdown Button */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium transition-all hover:bg-slate-200"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                      <span className="text-slate-700">
                        {user.displayName?.split(" ")[0] || "Account"}
                      </span>
                      <svg className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white py-2 shadow-lg ring-1 ring-slate-200 z-50">
                          <div className="border-b border-slate-100 px-4 py-3">
                            <p className="text-sm font-semibold text-slate-900">
                              {user.displayName || "User"}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                          </div>
                          
                          <Link
                            href="/dashboard/attendee"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            My Profile
                          </Link>
                          
                          <Link
                            href="/dashboard/bookings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            My Bookings
                          </Link>
                          
                          <hr className="my-1 border-slate-100" />
                          
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
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
                    <div className="border-t border-slate-100 pt-2">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-medium text-slate-900">{user.email}</p>
                    </div>
                    <Link 
                      href="/dashboard" 
                      className="text-sm font-medium hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/attendee" 
                      className="text-sm font-medium hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/dashboard/bookings" 
                      className="text-sm font-medium hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Bookings
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