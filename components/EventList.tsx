import EventCard from "./EventCard";

type Event = {
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

export default function EventList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-slate-700">No events found</p>
        <p className="mt-1 text-sm text-slate-500">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  );
}
