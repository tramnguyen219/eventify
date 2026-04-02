"use client";

import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateName = (name: string) => {
    if (!name.trim()) return "Full name is required.";
    if (name.trim().length < 2) return "Full name must be at least 2 characters.";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Za-z]/.test(password)) return "Password must include at least one letter.";
    if (!/\d/.test(password)) return "Password must include at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\/\[\]=+;'`~]/.test(password)) {
      return "Password must include at least one symbol.";
    }
    return "";
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return "Please confirm your password.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const validateForm = () => {
    const newErrors: FormErrors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedData = { ...formData, [id]: value };
    setFormData(updatedData);

    if (submitted) {
      const newErrors = { ...errors };

      if (id === "fullName") {
        newErrors.fullName = validateName(value);
      }

      if (id === "email") {
        newErrors.email = validateEmail(value);
      }

      if (id === "password") {
        newErrors.password = validatePassword(value);
        newErrors.confirmPassword = validateConfirmPassword(
          value,
          updatedData.confirmPassword
        );
      }

      if (id === "confirmPassword") {
        newErrors.confirmPassword = validateConfirmPassword(
          updatedData.password,
          value
        );
      }

      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) return;

    console.log("Form submitted:", formData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-xl ring-1 ring-slate-200 md:grid-cols-2">
          <div className="flex flex-col justify-between bg-slate-900 p-10 text-white">
            <div>
              <Link href="/" className="text-2xl font-bold tracking-tight">
                Eventify
              </Link>

              <p className="mt-6 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-blue-200">
                Create your account
              </p>

              <h1 className="mt-6 text-4xl font-bold leading-tight">
                Join Eventify and start managing events with ease.
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Sign up to create and manage events with a smooth and organized
                experience in one place.
              </p>
            </div>

            <div className="mt-10 rounded-2xl bg-white/5 p-4">
              <h2 className="text-lg font-semibold">Why join Eventify?</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>Create and manage events easily</li>
                <li>Access a clean and organized dashboard</li>
                <li>Track bookings and event details in one place</li>
              </ul>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <h2 className="text-3xl font-bold text-slate-900">Sign Up</h2>
              <p className="mt-2 text-sm text-slate-600">
                Create your organizer account to get started with Eventify.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
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
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
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
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
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
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    Password must be at least 8 characters and include a letter,
                    a number, and a symbol.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={`w-full rounded-2xl border px-4 py-3 pr-16 outline-none transition focus:ring-2 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                          : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-700"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
                >
                  Create Account
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Log in
                </Link>
              </p>

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}