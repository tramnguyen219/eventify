export type EventCategory =
  | "Technology"
  | "Design"
  | "Business"
  | "Community"
  | "Career"
  | "Entertainment";

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  date: Date;
  time: string;
  location: string;
  totalSeats: number;
  bookedSeats: number;
  organizerId: string;
  createdAt: Date;
}

export interface EventWithOrganizer extends Event {
  organizer: {
    id: string;
    fullName: string;
    organization?: string | null;
  };
}
