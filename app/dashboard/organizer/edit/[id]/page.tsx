"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type EditEventData = {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  seats: string;
  description: string;
};

export default function EditEventPage() {
  const [formData, setFormData] = useState<EditEventData>({
    title: "Future Innovators Summit",
    category: "Technology",
    date: "2026-04-18",
    time: "10:00",
    location: "Calgary, AB",
    seats: "120",
    description:
      "A technology event focused on innovation, software, and future trends.",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updated event:", formData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Organizer Tools
          </p>
          <h1 className="text-4xl font-bold text-slate-900">Edit Event</h1>
          <p className="mt-3 text-slate-600">
            Update your event information and keep the listing current.
          </p>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
                Event Title
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Community">Community</option>
                <option value="Career">Career</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="date" className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label htmlFor="time" className="mb-2 block text-sm font-medium text-slate-700">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label htmlFor="seats" className="mb-2 block text-sm font-medium text-slate-700">
                Available Seats
              </label>
              <input
                id="seats"
                type="number"
                value={formData.seats}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="flex-1 rounded-full border border-red-300 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Delete Event
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}