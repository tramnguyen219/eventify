"use client";

import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    return "";
  };

  const validateForm = () => {
    const newErrors: LoginErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
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
      if (id === "email") newErrors.email = validateEmail(value);
      if (id === "password") newErrors.password = validatePassword(value);
      if (newErrors.general) delete newErrors.general;
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      console.log("Logged in user:", userCredential.user);
      
      // Redirect to dashboard or home page after successful login
      router.push("/dashboard"); // or router.push("/") for home page
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/user-not-found':
          setErrors({ general: "No account found with this email address." });
          break;
        case 'auth/wrong-password':
          setErrors({ general: "Incorrect password. Please try again." });
          break;
        case 'auth/invalid-email':
          setErrors({ general: "Invalid email address format." });
          break;
        case 'auth/user-disabled':
          setErrors({ general: "This account has been disabled. Please contact support." });
          break;
        case 'auth/too-many-requests':
          setErrors({ general: "Too many failed attempts. Please try again later." });
          break;
        default:
          setErrors({ general: "Failed to log in. Please check your credentials and try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />

      <section className="mx-auto flex min-h-[calc(100vh-140px)] max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-xl ring-1 ring-slate-200 md:grid-cols-2">
          <div className="flex flex-col justify-between bg-slate-900 p-10 text-white">
            <div>
              <p className="mt-2 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-blue-200">
                Welcome back
              </p>

              <h1 className="mt-6 text-4xl font-bold leading-tight">
                Log in and manage your events with ease.
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
                Access your account to create events, manage bookings, and stay
                organized with Eventify.
              </p>
            </div>

            <div className="mt-10 rounded-2xl bg-white/5 p-4">
              <h2 className="text-lg font-semibold">What you can do</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>Manage your event dashboard</li>
                <li>Track bookings and registrations</li>
                <li>View event details in one place</li>
              </ul>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <h2 className="text-3xl font-bold text-slate-900">Log In</h2>
              <p className="mt-2 text-sm text-slate-600">
                Log in to continue using Eventify.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
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
                      placeholder="Enter your password"
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
                </div>

                {errors.general && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {errors.general}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <Link
                    href="/login/forgot-password"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Logging in...
                    </div>
                  ) : (
                    "Log In"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign up
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

      <Footer />
    </main>
  );
}