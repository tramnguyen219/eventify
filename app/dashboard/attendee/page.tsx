"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  onAuthStateChanged,
  User,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import { updateUserProfile } from "@/app/_services/eventService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AttendeeDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setProfileError("");
    try {
      if (user && displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      await updateUserProfile(user!.uid, {
        updatedAt: new Date().toISOString(),
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setProfileError("Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user!.email!, currentPassword);
      await reauthenticateWithCredential(user!, credential);
      await updatePassword(user!, newPassword);
      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        setPasswordError("Current password is incorrect");
      } else {
        setPasswordError("Failed to change password. Please try again.");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Attendee Dashboard
          </p>
          <h1 className="text-4xl font-bold text-slate-900">
            Welcome back, {user.displayName || user.email?.split("@")[0]}!
          </h1>
          <p className="mt-3 text-slate-600">
            Manage your profile, view bookings, and discover new events.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <Link
            href="/dashboard/bookings"
            className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm text-slate-500">My Bookings</p>
            <p className="mt-3 text-lg font-bold text-slate-900">View all bookings →</p>
          </Link>
          <Link
            href="/events"
            className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm text-slate-500">Browse Events</p>
            <p className="mt-3 text-lg font-bold text-slate-900">Explore events →</p>
          </Link>
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Account</p>
            <p className="mt-3 text-lg font-bold text-slate-900">{user.email}</p>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl bg-green-50 px-5 py-4 text-sm font-medium text-green-700 ring-1 ring-green-200">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Profile Information */}
          <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Profile Information</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                />
                <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {profileError && (
                <p className="text-sm text-red-600">{profileError}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="rounded-[28px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Change Password</h2>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full rounded-full border-2 border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>

        {/* Browse CTA */}
        <div className="mt-12 rounded-[28px] bg-slate-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Discover more events</h2>
          <p className="mt-2 text-slate-300">Find events that match your interests.</p>
          <Link
            href="/events"
            className="mt-6 inline-block rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Browse All Events
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
