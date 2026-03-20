import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import PublicationsPageClient from "@/features/publications/components/PublicationsPageClient";
import { publications } from "@/features/publications/lib/publications";
import { createPageMetadata } from "@/lib/metadata";
import { createPublicationsStructuredData } from "@/lib/structuredData";

export const metadata: Metadata = createPageMetadata({
  title: "Publications",
  description:
    "Browse books, reference works, and research projects by Kyrillos Wannes, including Coptic language publications and works in progress.",
  path: "/publications",
});

export default function PublicationsPage() {
  return (
    <>
      <StructuredData data={createPublicationsStructuredData(publications)} />
      <PublicationsPageClient />
    </>
  );
}
