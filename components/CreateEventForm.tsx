"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { auth } from "@/app/_utils/firebase";

type EventFormData = {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  seats: string;
  price: string;
  description: string;
};

type EventFormErrors = {
  title?: string;
  category?: string;
  date?: string;
  time?: string;
  location?: string;
  seats?: string;
  price?: string;
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
    price: "",
    description: "",
  });

  const [errors, setErrors] = useState<EventFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Validators ---
  const validateTitle = (v: string) => {
    if (!v.trim()) return "Event title is required.";
    if (v.trim().length < 3) return "Event title must be at least 3 characters.";
    return "";
  };
  const validateCategory = (v: string) => (!v.trim() ? "Category is required." : "");
  const validateDate = (v: string) => (!v ? "Date is required." : "");
  const validateTime = (v: string) => (!v ? "Time is required." : "");
  const validateLocation = (v: string) => {
    if (!v.trim()) return "Location is required.";
    if (v.trim().length < 2) return "Location must be at least 2 characters.";
    return "";
  };
  const validateSeats = (v: string) => {
    if (!v) return "Number of seats is required.";
    if (Number(v) < 1) return "Seats must be at least 1.";
    return "";
  };
  const validatePrice = (v: string) => {
    if (v === "") return "Price is required. Enter 0 for a free event.";
    if (Number(v) < 0) return "Price cannot be negative.";
    return "";
  };
  const validateDescription = (v: string) => {
    if (!v.trim()) return "Description is required.";
    if (v.trim().length < 10) return "Description must be at least 10 characters.";
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
      price: validatePrice(formData.price),
      description: validateDescription(formData.description),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (submitted) {
      const validators: Record<string, (v: string) => string> = {
        title: validateTitle,
        category: validateCategory,
        date: validateDate,
        time: validateTime,
        location: validateLocation,
        seats: validateSeats,
        price: validatePrice,
        description: validateDescription,
      };
      if (validators[id]) {
        setErrors((prev) => ({ ...prev, [id]: validators[id](value) }));
      }
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) return;

    setIsUploading(true);
    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const user = auth.currentUser;
        const path = `event-posters/${user?.uid ?? "unknown"}/${Date.now()}-${imageFile.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // TODO (groupmate): save to Firestore with createEvent({...formData, imageUrl})
      console.log("Event ready to save:", {
        ...formData,
        seats: Number(formData.seats),
        price: Number(formData.price),
        imageUrl,
      });

      setSuccessMessage("Event created successfully!");
      setFormData({
        title: "",
        category: "",
        date: "",
        time: "",
        location: "",
        seats: "",
        price: "",
        description: "",
      });
      removeImage();
      setErrors({});
      setSubmitted(false);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Image upload failed:", err);
      setErrors((prev) => ({ ...prev, title: "Failed to upload image. Please try again." }));
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass = (field: keyof EventFormErrors) =>
    `w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
    }`;

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

      {successMessage && (
        <div className="mb-6 rounded-2xl bg-green-50 px-5 py-4 text-sm font-medium text-green-700 ring-1 ring-green-200">
          {successMessage}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {/* Event Poster Image */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Event Poster Image <span className="font-normal text-slate-400">(Optional)</span>
          </label>
          {imagePreview ? (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200">
              <div className="relative h-48 w-full">
                <Image
                  src={imagePreview}
                  alt="Event poster preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Remove image"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 transition hover:border-blue-400 hover:bg-blue-50">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-slate-500">
                Click to upload a poster image
              </span>
              <span className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Title */}
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
            className={inputClass("title")}
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass("category")}
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

        {/* Date + Time */}
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
              className={inputClass("date")}
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
              className={inputClass("time")}
            />
            {errors.time && <p className="mt-2 text-sm text-red-600">{errors.time}</p>}
          </div>
        </div>

        {/* Location */}
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
            className={inputClass("location")}
          />
          {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
        </div>

        {/* Seats + Price */}
        <div className="grid gap-5 md:grid-cols-2">
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
              placeholder="e.g. 100"
              className={inputClass("seats")}
            />
            {errors.seats && <p className="mt-2 text-sm text-red-600">{errors.seats}</p>}
          </div>
          <div>
            <label htmlFor="price" className="mb-2 block text-sm font-medium text-slate-700">
              Ticket Price ($)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0 for free"
              className={inputClass("price")}
            />
            {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            className={inputClass("description")}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading...
            </span>
          ) : (
            "Create Event"
          )}
        </button>
      </form>
    </div>
  );
}
