import type { Metadata } from "next";
import AnalyticsPageClient from "@/features/analytics/components/AnalyticsPageClient";
import { createAnalyticsSnapshots } from "@/features/analytics/lib/analytics";
import { getDictionary } from "@/features/dictionary/lib/dictionary";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Dictionary Analytics",
  description:
    "Explore analytics for the Coptic dictionary, including parts of speech, noun genders, and other lexical distribution patterns.",
  path: "/analytics",
});

export default function AnalyticsPage() {
  return <AnalyticsPageClient snapshots={createAnalyticsSnapshots(getDictionary())} />;
}
