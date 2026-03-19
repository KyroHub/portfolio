import type { Metadata } from "next";
import AnalyticsPageClient from "@/components/AnalyticsPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Dictionary Analytics",
  description:
    "Explore analytics for the Coptic dictionary, including parts of speech, noun genders, and other lexical distribution patterns.",
  path: "/analytics",
});

export default function AnalyticsPage() {
  return <AnalyticsPageClient />;
}
