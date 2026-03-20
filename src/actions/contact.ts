"use server";

import { Resend } from "resend";
import {
  getContactInquiryLabel,
  isContactInquiryValue,
} from "@/features/contact/lib/contact";
import {
  consumeRateLimit,
  getClientRateLimitIdentifier,
} from "@/lib/rateLimit";
import {
  getFormString,
  hasLengthInRange,
  isValidEmail,
  normalizeMultiline,
  normalizeWhitespace,
} from "@/lib/validation";

export type ContactFormState = {
  success: boolean;
  error?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

export async function sendContactEmail(
  _prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  const name = normalizeWhitespace(getFormString(formData, "name"));
  const email = normalizeWhitespace(getFormString(formData, "email")).toLowerCase();
  const inquiryType = normalizeWhitespace(getFormString(formData, "inquiryType"));
  const message = normalizeMultiline(getFormString(formData, "message"));
  const honeypot = normalizeWhitespace(getFormString(formData, "website"));

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
    return { success: false, error: "Email service is not configured yet." };
  }

  if (honeypot) {
    return { success: true };
  }

  if (
    !hasLengthInRange(name, { min: 1, max: 100 }) ||
    !isValidEmail(email) ||
    !isContactInquiryValue(inquiryType) ||
    !hasLengthInRange(message, { min: 5, max: 5000 })
  ) {
    return {
      success: false,
      error: "Please complete all fields with valid values.",
    };
  }

  const clientIdentifier = await getClientRateLimitIdentifier();
  const contactRateLimit = consumeRateLimit({
    identifier: clientIdentifier,
    limit: 3,
    namespace: "contact",
    windowMs: 15 * 60 * 1000,
  });

  if (!contactRateLimit.ok) {
    return {
      success: false,
      error: "Too many messages were sent from this connection. Please wait a few minutes and try again.",
    };
  }

  try {
    const inquiryLabel = getContactInquiryLabel(inquiryType);

    await resend.emails.send({
      from: "Kyrillos Wannes <contact@kyrilloswannes.com>",
      to: [process.env.CONTACT_EMAIL],
      replyTo: email,
      subject: `New Contact: ${inquiryLabel} from ${name}`,
      html: `
        <strong>Name:</strong> ${escapeHtml(name)}<br>
        <strong>Email:</strong> ${escapeHtml(email)}<br>
        <strong>Type:</strong> ${escapeHtml(inquiryLabel)}<br><br>
        <strong>Message:</strong><br>
        ${escapeHtml(message).replace(/\n/g, "<br>")}
      `,
      text: `Name: ${name}\nEmail: ${email}\nType: ${inquiryLabel}\n\nMessage:\n${message}`,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email", error);
    return { success: false, error: "Failed to send email" };
  }
}
