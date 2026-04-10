"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock event data - will be replaced with Firestore call by groupmate
const getEventData = (id: string) => {
  return {
    id,
    title: "How Is AI Transforming Modern Enterprise Operations?",
    description: "Join industry experts as they discuss the latest AI trends reshaping business operations.",
    date: "2026-04-18T14:00:00",
    endDate: "2026-04-18T18:00:00",
    location: "Calgary, AB",
    address: "123 Tech Street, Calgary, AB T2P 1J9",
    venue: "Tech Convention Center, Hall A",
    seats: 120,
    bookedSeats: 45,
    price: 49.99,
    category: "Technology",
    organizer: "Tech Conference Group",
  };
};

export default function BookTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const event = getEventData(id);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    tickets: 1,
    specialRequests: "",
    agreeToTerms: false,
  });

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSeatMap, setShowSeatMap] = useState(false);

  const availableSeats = event.seats - event.bookedSeats;
  const totalPrice = formData.tickets * event.price;
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  const generateSeatMap = () => {
    const rows = ["A", "B", "C", "D", "E"];
    const seatsPerRow = 10;
    const bookedSeatsList = ["A3", "A7", "B2", "B5", "C4", "C8", "D1", "D9"];

    return rows.map((row) => ({
      row,
      seats: Array.from({ length: seatsPerRow }, (_, i) => {
        const seatNumber = `${row}${i + 1}`;
        return {
          number: seatNumber,
          isBooked: bookedSeatsList.includes(seatNumber),
          isSelected: selectedSeats.includes(seatNumber),
        };
      }),
    }));
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (!paymentMethod) {
      setErrors({ paymentMethod: "Please select a payment method" });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else if (currentStep === 2 && validateStep2()) {
      handleBooking();
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleBooking = async () => {
    setIsLoading(true);
    try {
      // TODO: groupmate will replace this with Firestore booking creation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push(`/events/${id}/book/confirmation`);
    } catch {
      setErrors({ submit: "Failed to complete booking. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSeatSelection = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else if (selectedSeats.length < formData.tickets) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      alert(`You can only select ${formData.tickets} seat(s).`);
    }
  };

  const seatMap = generateSeatMap();

  if (!isUpcoming) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Event Has Passed</h1>
            <p className="mb-6 text-slate-600">This event has already ended and cannot be booked.</p>
            <Link href="/events" className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Browse Other Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (availableSeats === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Event Sold Out</h1>
            <p className="mb-6 text-slate-600">All tickets for this event have been sold out.</p>
            <Link href="/events" className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Browse Other Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-slate-900">Eventify</Link>
          <Link href={`/events/${id}`} className="text-sm font-medium text-slate-600 hover:text-blue-600">
            ← Back to Event
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>1</div>
              <div className={`h-1 w-16 ${currentStep >= 2 ? "bg-blue-600" : "bg-slate-200"}`} />
              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>2</div>
            </div>
          </div>
          <div className="mt-2 flex justify-center gap-24 text-sm font-medium text-slate-600">
            <span>Your Information</span>
            <span>Payment</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {currentStep === 1 && (
                <>
                  <h2 className="mb-6 text-2xl font-bold text-slate-900">Ticket Information</h2>
                  <div className="space-y-6">
                    {/* Personal Details */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Personal Details</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">First Name *</label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Last Name *</label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Email Address *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Phone Number *</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Ticket Selection */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Select Tickets</h3>
                      <div className="rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">Regular Ticket</p>
                            <p className="text-sm text-slate-500">Standard admission · {availableSeats} seats left</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-slate-900">${event.price}</span>
                            <select name="tickets" value={formData.tickets} onChange={handleInputChange}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 outline-none focus:border-blue-500">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num} disabled={num > availableSeats}>
                                  {num} {num === 1 ? "ticket" : "tickets"}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Seat Map */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">Select Seats <span className="text-sm font-normal text-slate-500">(Optional)</span></h3>
                        <button type="button" onClick={() => setShowSeatMap(!showSeatMap)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700">
                          {showSeatMap ? "Hide Seat Map" : "Show Seat Map"}
                        </button>
                      </div>
                      {showSeatMap && (
                        <div className="overflow-x-auto rounded-xl border border-slate-200 p-4">
                          <div className="mb-4 text-center">
                            <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600">Stage / Screen</span>
                          </div>
                          <div className="space-y-2">
                            {seatMap.map((row) => (
                              <div key={row.row} className="flex justify-center gap-1.5">
                                <div className="w-6 text-center text-sm font-medium text-slate-400">{row.row}</div>
                                {row.seats.map((seat) => (
                                  <button key={seat.number} type="button"
                                    onClick={() => !seat.isBooked && handleSeatSelection(seat.number)}
                                    disabled={seat.isBooked}
                                    className={`h-7 w-7 rounded text-xs font-medium transition-all ${
                                      seat.isBooked ? "cursor-not-allowed bg-slate-200 text-slate-400"
                                        : seat.isSelected ? "bg-blue-600 text-white"
                                        : "border border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                                    }`}>
                                    {seat.number.slice(1)}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex justify-center gap-5 text-xs text-slate-600">
                            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded border border-slate-300 bg-white" /> Available</span>
                            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-blue-600" /> Selected</span>
                            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-slate-200" /> Taken</span>
                          </div>
                          <p className="mt-3 text-center text-sm text-slate-600">
                            {selectedSeats.length} of {formData.tickets} seat{formData.tickets > 1 ? "s" : ""} selected
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Special Requests <span className="font-normal text-slate-400">(Optional)</span></label>
                      <textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} rows={3}
                        placeholder="Dietary restrictions, accessibility needs, etc."
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>

                    {/* Terms */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} className="mt-0.5" />
                        <span className="text-sm text-slate-600">
                          I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        </span>
                      </label>
                      {errors.agreeToTerms && <p className="mt-1 text-xs text-red-600">{errors.agreeToTerms}</p>}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2 className="mb-6 text-2xl font-bold text-slate-900">Payment Information</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Select Payment Method</h3>
                      <div className="space-y-3">
                        {[
                          { value: "credit_card", label: "Credit / Debit Card", desc: "Visa, Mastercard, or American Express" },
                          { value: "paypal", label: "PayPal", desc: "Pay securely with your PayPal account" },
                        ].map((method) => (
                          <label key={method.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition-all hover:bg-slate-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                            <input type="radio" name="paymentMethod" value={method.value}
                              checked={paymentMethod === method.value}
                              onChange={(e) => setPaymentMethod(e.target.value)} className="text-blue-600" />
                            <div>
                              <p className="font-medium text-slate-900">{method.label}</p>
                              <p className="text-sm text-slate-500">{method.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.paymentMethod && <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>}
                    </div>

                    {paymentMethod === "credit_card" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Card Details</h3>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Card Number</label>
                          <input type="text" placeholder="1234 5678 9012 3456"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Expiry Date</label>
                            <input type="text" placeholder="MM/YY"
                              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">CVV</label>
                            <input type="text" placeholder="123"
                              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Cardholder Name</label>
                          <input type="text" placeholder="John Doe"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Billing Address</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
                          <input type="text" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
                            <input type="text" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Postal Code</label>
                            <input type="text" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {errors.submit && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.submit}</div>
                    )}
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="mt-8 flex gap-4">
                {currentStep === 2 && (
                  <button onClick={handlePreviousStep}
                    className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Back
                  </button>
                )}
                <button onClick={handleNextStep} disabled={isLoading}
                  className="flex-1 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : currentStep === 1 ? "Continue to Payment" : "Complete Booking"}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Order Summary</h3>
              <div className="mb-4">
                <h4 className="font-semibold text-slate-900">{event.title}</h4>
                <p className="mt-1 text-sm text-slate-500">
                  {eventDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
                <p className="text-sm text-slate-500">{event.venue}</p>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ticket price</span>
                  <span>${event.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quantity</span>
                  <span>{formData.tickets}</span>
                </div>
                {selectedSeats.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Seats</span>
                    <span>{selectedSeats.join(", ")}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-green-50 p-3 text-xs text-green-800">
                <span className="font-semibold">Secure Booking</span> — your information is protected with SSL encryption.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
