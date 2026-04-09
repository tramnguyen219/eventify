export type UserRole = "ORGANIZER" | "ATTENDEE";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  organization?: string | null;
  createdAt: Date;
}

export interface SessionPayload {
  userId: string;
  role: UserRole;
  expiresAt: Date;
}
