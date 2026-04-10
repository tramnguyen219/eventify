"use client";

import Link from "next/link";
import Image from "next/image";
import { getCategoryImage } from "@/lib/categoryImages";

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "bg-blue-100 text-blue-700",
  Design: "bg-purple-100 text-purple-700",
  Business: "bg-green-100 text-green-700",
  Community: "bg-orange-100 text-orange-700",
  Career: "bg-yellow-100 text-yellow-700",
  Entertainment: "bg-pink-100 text-pink-700",
};

type EventCardProps = {
  id: string | number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  totalSeats: number;
  bookedSeats?: number;
  price?: number;
  imageUrl?: string;
};

export default function EventCard({
  id,
  title,
  category,
  date,
  time,
  location,
  totalSeats,
  bookedSeats = 0,
  price,
  imageUrl,
}: EventCardProps) {
  const available = totalSeats - bookedSeats;
  const isSoldOut = available <= 0;
  const colorClass = CATEGORY_COLORS[category] ?? "bg-slate-100 text-slate-700";

  return (
    <Link
      href={`/events/${id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Poster image — uses event-specific image, or falls back to category image */}
      <div className="relative h-48 w-full bg-gradient-to-r from-blue-600 to-slate-900">
        <Image
          src={imageUrl ?? getCategoryImage(category)}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
        {isSoldOut && (
          <div className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Sold Out
          </div>
        )}
      </div>

      <div className="p-5">
        <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${colorClass}`}>
          {category}
        </span>
        <h3 className="mt-2 line-clamp-2 font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
          {title}
        </h3>
        <div className="mt-3 space-y-1 text-sm text-slate-500">
          <p>
            {date} · {time}
          </p>
          <p>{location}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">
            {price === undefined || price === 0 ? "Free" : `$${price.toFixed(2)}`}
          </span>
          <span
            className={`text-xs ${
              isSoldOut
                ? "text-red-500"
                : available <= 10
                  ? "text-orange-500"
                  : "text-slate-400"
            }`}
          >
            {isSoldOut ? "No seats left" : `${available} seats left`}
          </span>
        </div>
      </div>
    </Link>
  );
}
