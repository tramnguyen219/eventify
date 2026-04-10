"use client";

import React, { useState, ChangeEvent } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
};

type ProfileErrors = {
  fullName?: string;
  general?: string;
};

export default function ProfileForm({ initialData }: { initialData?: Partial<ProfileData> }) {
  const [formData, setFormData] = useState<ProfileData>({
    fullName: initialData?.fullName ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    organization: initialData?.organization ?? "",
  });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof ProfileErrors]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrors({ fullName: "Full name is required." });
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: formData.fullName });
        // TODO (groupmate): update additional fields in Firestore
        console.log("Profile updated:", formData);
      }
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch {
      setErrors({ general: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {successMessage && (
        <div className="rounded-2xl bg-green-50 px-5 py-3 text-sm font-medium text-green-700 ring-1 ring-green-200">
          {successMessage}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your full name"
          className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
            errors.fullName
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />
        {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          disabled
          className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-400 outline-none"
        />
        <p className="mt-1 text-xs text-slate-400">Email cannot be changed.</p>
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
          Phone Number <span className="font-normal text-slate-400">(Optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. +1 403 555 0100"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div>
        <label htmlFor="organization" className="mb-2 block text-sm font-medium text-slate-700">
          Organization <span className="font-normal text-slate-400">(Optional)</span>
        </label>
        <input
          id="organization"
          type="text"
          value={formData.organization}
          onChange={handleChange}
          placeholder="Your company or school"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {errors.general && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.general}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
