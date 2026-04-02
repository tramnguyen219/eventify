// app/login/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // TODO: Implement Firebase password reset in Sprint 2
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
            Eventify
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="/events" className="text-sm font-medium hover:text-blue-600">
              Events
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-blue-600">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Reset Password Form Section */}
      <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM9 12.75a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
                  </svg>
                </div>
                <h1 className="mb-2 text-2xl font-bold text-slate-900">Reset your password</h1>
                <p className="text-sm text-slate-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Form Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>

                  {/* Back to Login Link */}
                  <div className="text-center">
                    <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              </div>
            </>
          ) : (
            // Success State
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900">Check your email</h2>
              <p className="mb-6 text-sm text-slate-600">
                We've sent a password reset link to <strong className="text-slate-900">{email}</strong>
              </p>
              <p className="mb-6 text-xs text-slate-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                >
                  Try another email
                </button>
                <Link
                  href="/login"
                  className="inline-block w-full rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}