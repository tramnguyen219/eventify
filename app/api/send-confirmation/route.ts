import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const {
    attendeeName,
    attendeeEmail,
    eventTitle,
    eventDate,
    location,
    tickets,
    totalAmount,
  } = await req.json();

  try {
    await resend.emails.send({
      from: "Eventify <onboarding@resend.dev>", // swap for your domain in production
      to: attendeeEmail,
      subject: `Booking Confirmed – ${eventTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <div style="background: #2563eb; padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">You're going! 🎉</h1>
          </div>
          <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 16px 16px;">
            <p style="margin-top: 0;">Hi <strong>${attendeeName}</strong>,</p>
            <p>Your booking for <strong>${eventTitle}</strong> is confirmed.</p>

            <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px;"><strong>📅 Date:</strong> ${eventDate}</p>
              <p style="margin: 0 0 10px;"><strong>📍 Location:</strong> ${location}</p>
              <p style="margin: 0 0 10px;"><strong>🎟 Tickets:</strong> ${tickets}</p>
              <p style="margin: 0;"><strong>💰 Total:</strong> ${
                totalAmount === 0 ? "Free" : `$${Number(totalAmount).toFixed(2)}`
              }</p>
            </div>

            <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
              See you there! — The Eventify Team
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}