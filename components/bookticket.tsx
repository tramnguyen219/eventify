// app/events/[id]/book/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Mock event data - will be replaced with API call in Sprint 2
const getEventData = (id: string) => {
  return {
    id: id,
    title: "How Is AI Transforming Modern Enterprise Operations?",
    description: "Join industry experts as they discuss the latest AI trends and how they're reshaping business operations across various sectors. This comprehensive conference will cover machine learning applications, automation strategies, and future predictions for enterprise AI adoption.",
    longDescription: "This full-day conference brings together leading AI experts, business leaders, and technology innovators to explore the transformative power of artificial intelligence in modern enterprises. Attendees will gain insights into practical AI implementations, learn about emerging technologies, and network with industry peers.\n\nKey topics include:\n• Generative AI in business operations\n• Machine learning for predictive analytics\n• AI ethics and governance\n• Automation and workforce transformation\n• Case studies from successful implementations",
    date: "2026-04-18T14:00:00",
    endDate: "2026-04-18T18:00:00",
    location: "Calgary, AB",
    address: "123 Tech Street, Calgary, AB T2P 1J9",
    venue: "Tech Convention Center, Hall A",
    seats: 120,
    bookedSeats: 45,
    price: 49.99,
    category: "Technology",
    imageUrl: "/api/placeholder/800/400",
    organizer: "Tech Conference Group",
    organizerEmail: "contact@techconference.com",
    tags: ["AI", "Machine Learning", "Enterprise", "Technology"],
    speakers: [
      { name: "Dr. Sarah Johnson", role: "AI Research Director", company: "Tech Innovations Inc." },
      { name: "Michael Chen", role: "CTO", company: "Enterprise AI Solutions" }
    ]
  };
};

export default function BookTicketPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const event = getEventData(params.id);
  
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

  // Generate seat map (mock data)
  const generateSeatMap = () => {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 10;
    const bookedSeatsList = ['A3', 'A7', 'B2', 'B5', 'C4', 'C8', 'D1', 'D9'];
    
    return rows.map(row => ({
      row,
      seats: Array.from({ length: seatsPerRow }, (_, i) => {
        const seatNumber = `${row}${i + 1}`;
        const isBooked = bookedSeatsList.includes(seatNumber);
        const isSelected = selectedSeats.includes(seatNumber);
        return { number: seatNumber, isBooked, isSelected };
      })
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
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";
    
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
      // TODO: Implement actual booking API in Sprint 2
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful booking
      console.log("Booking details:", {
        eventId: event.id,
        ...formData,
        selectedSeats,
        paymentMethod,
        totalPrice
      });
      
      // Redirect to success page
      router.push(`/events/${event.id}/booking-confirmation?bookingId=temp123`);
    } catch (error) {
      console.error("Booking error:", error);
      setErrors({ submit: "Failed to complete booking. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSeatSelection = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < formData.tickets) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      alert(`You can only select ${formData.tickets} seat(s). Please adjust the number of tickets or deselect some seats.`);
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
            <Link
              href="/events"
              className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
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
            <Link
              href="/events"
              className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Browse Other Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
            Eventify
          </Link>

          <div className="flex items-center gap-4">
            <Link href={`/events/${event.id}`} className="text-sm font-medium text-slate-600 hover:text-blue-600">
              Back to Event
            </Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                1
              </div>
              <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                2
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-center gap-24">
            <span className="text-sm font-medium text-slate-600">Your Information</span>
            <span className="text-sm font-medium text-slate-600">Payment</span>
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
                    {/* Personal Information */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Personal Details</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          />
                          {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          />
                          {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          />
                          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          />
                          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Ticket Selection */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Select Tickets</h3>
                      <div className="rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">Regular Ticket</p>
                            <p className="text-sm text-slate-600">Standard admission to the event</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-slate-900">${event.price}</span>
                            <select
                              name="tickets"
                              value={formData.tickets}
                              onChange={handleInputChange}
                              className="rounded-lg border border-slate-200 px-3 py-1"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num} disabled={num > availableSeats}>
                                  {num} {num === 1 ? 'ticket' : 'tickets'}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Seat Selection (Optional) */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">Select Seats (Optional)</h3>
                        <button
                          type="button"
                          onClick={() => setShowSeatMap(!showSeatMap)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {showSeatMap ? 'Hide Seat Map' : 'Show Seat Map'}
                        </button>
                      </div>
                      
                      {showSeatMap && (
                        <div className="overflow-x-auto rounded-lg border border-slate-200 p-4">
                          <div className="mb-4 text-center">
                            <div className="inline-block rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600">
                              Stage
                            </div>
                          </div>
                          <div className="space-y-2">
                            {seatMap.map((row) => (
                              <div key={row.row} className="flex justify-center gap-2">
                                <div className="w-8 text-center font-medium text-slate-500">{row.row}</div>
                                {row.seats.map((seat) => (
                                  <button
                                    key={seat.number}
                                    onClick={() => !seat.isBooked && handleSeatSelection(seat.number)}
                                    disabled={seat.isBooked}
                                    className={`h-8 w-8 rounded text-xs font-medium transition-all ${
                                      seat.isBooked
                                        ? 'bg-slate-200 cursor-not-allowed text-slate-400'
                                        : seat.isSelected
                                        ? 'bg-blue-600 text-white'
                                        : 'border border-slate-300 bg-white text-slate-700 hover:border-blue-600 hover:bg-blue-50'
                                    }`}
                                  >
                                    {seat.number.slice(1)}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex justify-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded bg-white border border-slate-300"></div>
                              <span>Available</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded bg-blue-600"></div>
                              <span>Selected</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-3 w-3 rounded bg-slate-200"></div>
                              <span>Booked</span>
                            </div>
                          </div>
                          <p className="mt-4 text-center text-sm text-slate-600">
                            Selected: {selectedSeats.length} of {formData.tickets} seats
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Dietary restrictions, accessibility needs, etc."
                      />
                    </div>

                    {/* Terms and Conditions */}
                    <div>
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
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
                    {/* Payment Methods */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Select Payment Method</h3>
                      <div className="space-y-3">
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="credit_card"
                            checked={paymentMethod === "credit_card"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-blue-600"
                          />
                          <div>
                            <p className="font-medium text-slate-900">Credit / Debit Card</p>
                            <p className="text-sm text-slate-500">Pay with Visa, Mastercard, or American Express</p>
                          </div>
                        </label>
                        
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={paymentMethod === "paypal"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="text-blue-600"
                          />
                          <div>
                            <p className="font-medium text-slate-900">PayPal</p>
                            <p className="text-sm text-slate-500">Pay securely with your PayPal account</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {paymentMethod === "credit_card" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Card Details</h3>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {errors.paymentMethod && (
                      <p className="text-sm text-red-600">{errors.paymentMethod}</p>
                    )}

                    {/* Billing Address */}
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-slate-900">Billing Address</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Address Line 1</label>
                          <input
                            type="text"
                            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
                            <input
                              type="text"
                              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Postal Code</label>
                            <input
                              type="text"
                              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex gap-4">
                {currentStep === 2 && (
                  <button
                    onClick={handlePreviousStep}
                    className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="flex-1 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    currentStep === 1 ? "Continue to Payment" : "Complete Booking"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Order Summary</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-slate-900">{event.title}</h4>
                <p className="mt-1 text-sm text-slate-600">
                  {eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-slate-600">
                  {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-slate-600">{event.venue}</p>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Ticket Price</span>
                  <span className="text-slate-900">${event.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Quantity</span>
                  <span className="text-slate-900">{formData.tickets}</span>
                </div>
                {selectedSeats.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Selected Seats</span>
                    <span className="text-slate-900">{selectedSeats.join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">✓ Secure Booking</span>
                  <br />
                  Your information is protected with SSL encryption.
                </p>
              </div>

              <div className="mt-4 text-center text-xs text-slate-500">
                <p>By completing this booking, you agree to our</p>
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                {" and "}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}