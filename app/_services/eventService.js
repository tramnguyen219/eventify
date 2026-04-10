import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { db } from "@/app/_utils/firebase";

// Collection references
const eventsCollection = collection(db, "events");
const bookingsCollection = collection(db, "bookings");
const usersCollection = collection(db, "users");

// Create a new event
export async function createEvent(eventData, userId) {
  try {
    const event = {
      ...eventData,
      organizerId: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      bookedSeats: 0,
      status: "published",
    };
    const docRef = await addDoc(eventsCollection, event);
    return { id: docRef.id, ...event };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

// Get all events
export async function getAllEvents() {
  try {
    const q = query(eventsCollection, orderBy("date", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

// Get events by organizer
export async function getOrganizerEvents(userId) {
  try {
    const q = query(eventsCollection, where("organizerId", "==", userId), orderBy("date", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    throw error;
  }
}

// Get single event by ID
export async function getEventById(eventId) {
  try {
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

// Update event
export async function updateEvent(eventId, eventData) {
  try {
    const docRef = doc(db, "events", eventId);
    await updateDoc(docRef, {
      ...eventData,
      updatedAt: Timestamp.now(),
    });
    return { id: eventId, ...eventData };
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

// Delete event
export async function deleteEvent(eventId) {
  try {
    const docRef = doc(db, "events", eventId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

// Create booking
export async function createBooking(bookingData, userId, eventId) {
  try {
    const booking = {
      ...bookingData,
      userId: userId,
      eventId: eventId,
      bookingDate: Timestamp.now(),
      status: "confirmed",
    };
    const docRef = await addDoc(bookingsCollection, booking);

    // Update event booked seats count
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);
    if (eventDoc.exists()) {
      const currentBooked = eventDoc.data().bookedSeats || 0;
      await updateDoc(eventRef, {
        bookedSeats: currentBooked + (bookingData.tickets ?? 1),
      });
    }

    return { id: docRef.id, ...booking };
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

// Get user bookings
export async function getUserBookings(userId) {
  try {
    const q = query(bookingsCollection, where("userId", "==", userId), orderBy("bookingDate", "desc"));
    const querySnapshot = await getDocs(q);
    const bookings = [];

    for (const bookingDoc of querySnapshot.docs) {
      const booking = { id: bookingDoc.id, ...bookingDoc.data() };
      const event = await getEventById(booking.eventId);
      bookings.push({ ...booking, event });
    }

    return bookings;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
}

// Cancel booking
export async function cancelBooking(bookingId, eventId, tickets) {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { status: "cancelled" });

    // Update event booked seats count
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);
    if (eventDoc.exists()) {
      const currentBooked = eventDoc.data().bookedSeats || 0;
      await updateDoc(eventRef, {
        bookedSeats: Math.max(0, currentBooked - (tickets ?? 1)),
      });
    }

    return true;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
}

// Create or update user profile in Firestore
export async function updateUserProfile(userId, userData) {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        ...userData,
        updatedAt: Timestamp.now(),
      });
    } else {
      await addDoc(usersCollection, {
        userId: userId,
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Get user profile from Firestore
export async function getUserProfile(userId) {
  try {
    const q = query(usersCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
