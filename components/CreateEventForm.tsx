"use client";

import { useState, ChangeEvent, FormEvent } from "react";

type EventFormData = {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  seats: string;
  description: string;
};

type EventFormErrors = {
  title?: string;
  category?: string;
  date?: string;
  time?: string;
  location?: string;
  seats?: string;
  description?: string;
};

export default function CreateEventForm() {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    seats: "",
    description: "",
  });

  const [errors, setErrors] = useState<EventFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateTitle = (title: string) => {
    if (!title.trim()) return "Event title is required.";
    if (title.trim().length < 3) return "Event title must be at least 3 characters.";
    return "";
  };

  const validateCategory = (category: string) => {
    if (!category.trim()) return "Category is required.";
    return "";
  };

  const validateDate = (date: string) => {
    if (!date) return "Date is required.";
    return "";
  };

  const validateTime = (time: string) => {
    if (!time) return "Time is required.";
    return "";
  };

  const validateLocation = (location: string) => {
    if (!location.trim()) return "Location is required.";
    if (location.trim().length < 2) return "Location must be at least 2 characters.";
    return "";
  };

  const validateSeats = (seats: string) => {
    if (!seats) return "Number of seats is required.";
    if (Number(seats) < 1) return "Seats must be at least 1.";
    return "";
  };

  const validateDescription = (description: string) => {
    if (!description.trim()) return "Description is required.";
    if (description.trim().length < 10) {
      return "Description must be at least 10 characters.";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors: EventFormErrors = {
      title: validateTitle(formData.title),
      category: validateCategory(formData.category),
      date: validateDate(formData.date),
      time: validateTime(formData.time),
      location: validateLocation(formData.location),
      seats: validateSeats(formData.seats),
      description: validateDescription(formData.description),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    const updatedData = { ...formData, [id]: value };
    setFormData(updatedData);

    if (submitted) {
      const newErrors = { ...errors };

      if (id === "title") newErrors.title = validateTitle(value);
      if (id === "category") newErrors.category = validateCategory(value);
      if (id === "date") newErrors.date = validateDate(value);
      if (id === "time") newErrors.time = validateTime(value);
      if (id === "location") newErrors.location = validateLocation(value);
      if (id === "seats") newErrors.seats = validateSeats(value);
      if (id === "description") newErrors.description = validateDescription(value);

      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) return;

    console.log("Event created:", formData);

    setFormData({
      title: "",
      category: "",
      date: "",
      time: "",
      location: "",
      seats: "",
      description: "",
    });

    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <div className="mb-8">
        <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
          Organizer Tools
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Create Event</h1>
        <p className="mt-2 text-sm text-slate-600">
          Fill in the details below to create a new event listing.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
            Event Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
              errors.title
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
              errors.category
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Design">Design</option>
            <option value="Community">Community</option>
            <option value="Career">Career</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
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
              className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
                errors.date
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date}</p>}
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
              className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
                errors.time
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.time && <p className="mt-2 text-sm text-red-600">{errors.time}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block text-sm font-medium text-slate-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
              errors.location
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          {errors.location && (
            <p className="mt-2 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        <div>
          <label htmlFor="seats" className="mb-2 block text-sm font-medium text-slate-700">
            Available Seats
          </label>
          <input
            id="seats"
            type="number"
            min="1"
            value={formData.seats}
            onChange={handleChange}
            placeholder="Enter number of seats"
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
              errors.seats
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          {errors.seats && <p className="mt-2 text-sm text-red-600">{errors.seats}</p>}
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
            placeholder="Enter event description"
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
              errors.description
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}