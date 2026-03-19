"use server";

import { Resend } from "resend";

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
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const inquiryType = formData.get("inquiryType")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";
  const honeypot = formData.get("website")?.toString().trim() ?? "";

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
    return { success: false, error: "Email service is not configured yet." };
  }

  if (!name || !email || !inquiryType || !message || honeypot) {
    return { success: false, error: "Invalid submission" };
  }

  try {
    await resend.emails.send({
      from: "Kyrillos Wannes <contact@kyrilloswannes.com>",
      to: [process.env.CONTACT_EMAIL],
      replyTo: email,
      subject: `New Contact: ${inquiryType} from ${name}`,
      html: `
        <strong>Name:</strong> ${escapeHtml(name)}<br>
        <strong>Email:</strong> ${escapeHtml(email)}<br>
        <strong>Type:</strong> ${escapeHtml(inquiryType)}<br><br>
        <strong>Message:</strong><br>
        ${escapeHtml(message).replace(/\n/g, "<br>")}
      `,
      text: `Name: ${name}\nEmail: ${email}\nType: ${inquiryType}\n\nMessage:\n${message}`,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email", error);
    return { success: false, error: "Failed to send email" };
  }
}
