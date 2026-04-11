"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import { getEventById, createBooking } from "@/app/_services/eventService";

type BookTicketProps = {
  eventId: string;
};

export default function BookTicket({ eventId }: BookTicketProps) {
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    tickets: 1,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    getEventById(eventId)
      .then((data: any) => {
        if (!data) setFetchError("Event not found.");
        else setEvent(data);
      })
      .catch(() => setFetchError("Failed to load event."))
      .finally(() => setLoadingEvent(false));

    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, [eventId]);

  const isFree = !event?.price || event.price === 0;
  const availableSeats = event
    ? (event.seats ?? event.totalSeats ?? 0) - (event.bookedSeats || 0)
    : 0;
  const totalPrice = event ? formData.tickets * (event.price || 0) : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required.";
    if (!formData.lastName.trim()) e.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      e.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      e.email = "Enter a valid email address.";
    }
    if (!formData.phone.trim()) e.phone = "Phone number is required.";
    if (!formData.agreeToTerms) e.agreeToTerms = "You must agree to the terms.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!user) {
      router.push(`/login?redirect=/events/${eventId}/book`);
      return;
    }

    setIsSubmitting(true);
    try {
      await createBooking(
        {
          tickets: formData.tickets,
          totalAmount: totalPrice,
          attendeeName: `${formData.firstName} ${formData.lastName}`,
          attendeeEmail: formData.email,
          attendeePhone: formData.phone,
          eventTitle: event.title,
          eventDate: event.date,
          location: event.location,
        },
        user.uid,
        eventId
      );

      // Send confirmation email — non-blocking
      fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendeeName: `${formData.firstName} ${formData.lastName}`,
          attendeeEmail: formData.email,
          eventTitle: event.title,
          eventDate: event.date,
          location: event.location,
          tickets: formData.tickets,
          totalAmount: totalPrice,
        }),
      }).catch((err) => console.error("Email send failed:", err));

      setConfirmed(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Booking failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Loading ---
  if (loadingEvent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (fetchError || !event) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600">{fetchError || "Event not found."}</p>
        <Link href="/events" className="mt-4 inline-block text-blue-600 hover:underline">
          Browse events
        </Link>
      </div>
    );
  }

  if (availableSeats <= 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">This event is sold out</h2>
        <Link href="/events" className="mt-6 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          Browse Other Events
        </Link>
      </div>
    );
  }

  // --- Confirmation ---
  if (confirmed) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Ticket Booked!</h1>
        <p className="mt-3 text-slate-500">
          A confirmation email has been sent to{" "}
          <span className="font-semibold text-slate-800">{formData.email}</span>.
        </p>

        <div className="mx-auto mt-8 rounded-[24px] bg-white p-6 text-left shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Your Booking</p>
          <h2 className="mt-3 text-lg font-bold text-slate-900">{event.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{event.date} · {event.location}</p>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900">{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tickets</span>
              <span className="font-medium text-slate-900">{formData.tickets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total</span>
              <span className="font-bold text-blue-600">{isFree ? "Free" : `$${totalPrice.toFixed(2)}`}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/dashboard/bookings" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            View My Bookings
          </Link>
          <Link href="/events" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Browse More Events
          </Link>
        </div>
      </div>
    );
  }

  // --- Booking Form ---
  const inputClass = (field: string) =>
    `w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:ring-red-100"
        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
    }`;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Form */}
      <div className="lg:col-span-2">
        <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Your Information</h2>

          <div className="space-y-5">
            {/* Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={inputClass("firstName")}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={inputClass("lastName")}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={inputClass("email")}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (403) 555-0100"
                className={inputClass("phone")}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>

            {/* Ticket Quantity */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Number of Tickets</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, tickets: Math.max(1, p.tickets - 1) }))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-lg text-slate-700 hover:bg-slate-50"
                >
                  −
                </button>
                <span className="w-8 text-center text-xl font-bold text-slate-900">{formData.tickets}</span>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, tickets: Math.min(availableSeats, p.tickets + 1) }))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-lg text-slate-700 hover:bg-slate-50"
                >
                  +
                </button>
                <span className="text-sm text-slate-400">{availableSeats} seats left</span>
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm text-slate-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeToTerms && <p className="mt-1 text-xs text-red-600">{errors.agreeToTerms}</p>}
            </div>

            {errors.submit && (
              <p className="text-sm text-red-600">{errors.submit}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-8 w-full rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Booking...
              </span>
            ) : isFree ? (
              "Confirm Free Registration"
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Order Summary</p>
          <h3 className="mt-3 font-bold text-slate-900">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{event.date}</p>
          <p className="text-sm text-slate-500">{event.location}</p>

          <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Price per ticket</span>
              <span className="text-slate-900">{isFree ? "Free" : `$${Number(event.price).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Quantity</span>
              <span className="text-slate-900">{formData.tickets}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-3 font-bold">
              <span>Total</span>
              <span className="text-blue-600">{isFree ? "Free" : `$${totalPrice.toFixed(2)}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}