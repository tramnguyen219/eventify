"use client";

import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";

type UserRole = "organizer" | "attendee";

type FormErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "attendee" as UserRole,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateFullName = (v: string) => {
    if (!v.trim()) return "Full name is required.";
    if (v.trim().length < 2) return "Full name must be at least 2 characters.";
    return "";
  };
  const validateEmail = (v: string) => {
    if (!v.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Please enter a valid email.";
    return "";
  };
  const validatePassword = (v: string) => {
    if (!v) return "Password is required.";
    if (v.length < 6) return "Password must be at least 6 characters.";
    return "";
  };
  const validateConfirmPassword = (v: string, pw: string) => {
    if (!v) return "Please confirm your password.";
    if (v !== pw) return "Passwords do not match.";
    return "";
  };

  const validateForm = () => {
    const newErrors: FormErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (submitted) {
      const validators: Record<string, (v: string) => string> = {
        fullName: validateFullName,
        email: validateEmail,
        password: validatePassword,
        confirmPassword: (v) => validateConfirmPassword(v, formData.password),
      };
      if (validators[id]) {
        setErrors((prev) => ({ ...prev, [id]: validators[id](value), general: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setErrors({});
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(userCredential.user, { displayName: formData.fullName });
      // TODO (groupmate): save user role to Firestore
      console.log("User created:", { uid: userCredential.user.uid, role: formData.role });
      router.push("/dashboard");
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      const messages: Record<string, string> = {
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/invalid-email": "Invalid email address.",
        "auth/weak-password": "Password is too weak.",
      };
      setErrors({ general: messages[code ?? ""] ?? "Failed to create account. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
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
          onChange={handleChange}
          placeholder="Enter your email"
          className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />
        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            className={`w-full rounded-2xl border px-4 py-3 pr-16 outline-none transition focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          className={`w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${
            errors.confirmPassword
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
        />
        {errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Role selection */}
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">I am joining as a</p>
        <div className="grid grid-cols-2 gap-3">
          {(["attendee", "organizer"] as UserRole[]).map((r) => (
            <label
              key={r}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                formData.role === r
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={formData.role === r}
                onChange={() => setFormData((prev) => ({ ...prev, role: r }))}
                className="text-blue-600"
              />
              <span className="text-sm font-medium capitalize text-slate-800">{r}</span>
            </label>
          ))}
        </div>
      </div>

      {errors.general && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.general}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
