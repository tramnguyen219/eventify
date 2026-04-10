export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

export interface Booking {
  id: string;
  eventId: string;
  attendeeId: string;
  status: BookingStatus;
  createdAt: Date;
}

export interface BookingWithEvent extends Booking {
  event: {
    id: string;
    title: string;
    date: Date;
    time: string;
    location: string;
    category: string;
  };
}
