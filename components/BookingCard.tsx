"use client";

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

type BookingCardProps = {
  id: number | string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  tickets?: number;
  totalAmount?: number;
  status: string;
  onCancel?: (id: number | string) => void;
  cancelling?: boolean;
};

export default function BookingCard({
  id,
  eventTitle,
  eventDate,
  eventLocation,
  tickets = 1,
  totalAmount,
  status,
  onCancel,
  cancelling,
}: BookingCardProps) {
  const statusLabel =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  const styleClass = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600";
  const isCancelled =
    status === "CANCELLED" || status === "Cancelled";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{eventTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {eventDate} · {eventLocation}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {tickets} {tickets === 1 ? "ticket" : "tickets"}
            {totalAmount !== undefined && ` · $${totalAmount.toFixed(2)}`}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${styleClass}`}
        >
          {statusLabel}
        </span>
      </div>

      {!isCancelled && onCancel && (
        <button
          onClick={() => onCancel(id)}
          disabled={cancelling}
          className="mt-4 rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {cancelling ? "Cancelling..." : "Cancel Booking"}
        </button>
      )}
    </div>
  );
}
