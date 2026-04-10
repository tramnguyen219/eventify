"use client";

import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

type OrganizerEventCardProps = {
  id: number | string;
  title: string;
  date: string;
  location: string;
  seats: number;
  bookedSeats?: number;
  status?: "published" | "draft" | "cancelled";
  onDelete?: (id: number | string) => void;
  deleting?: boolean;
};

export default function OrganizerEventCard({
  id,
  title,
  date,
  location,
  seats,
  bookedSeats = 0,
  status = "published",
  onDelete,
  deleting,
}: OrganizerEventCardProps) {
  const fillPercent = seats > 0 ? Math.round((bookedSeats / seats) * 100) : 0;
  const styleClass = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {date} · {location}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${styleClass}`}>
          {status}
        </span>
      </div>

      {/* Seat fill bar */}
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>{bookedSeats} booked</span>
          <span>{seats - bookedSeats} remaining</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-2 rounded-full transition-all ${
              fillPercent >= 90 ? "bg-red-500" : fillPercent >= 60 ? "bg-orange-400" : "bg-blue-600"
            }`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-slate-400">{fillPercent}% full</p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <Link
          href={`/dashboard/organizer/edit/${id}`}
          className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit
        </Link>
        <Link
          href={`/events/${id}`}
          className="rounded-full border border-blue-200 px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          View
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            disabled={deleting}
            className="ml-auto rounded-full border border-red-200 px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}
