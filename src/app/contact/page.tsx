import type { Metadata } from "next";
import ContactPageClient from "@/features/contact/components/ContactPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Kyrillos Wannes for dictionary feedback, grammar questions, research collaboration, publication inquiries, or general scholarly correspondence.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}
