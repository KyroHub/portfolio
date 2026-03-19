import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import PublicationsPageClient from "@/components/PublicationsPageClient";
import { createPageMetadata } from "@/lib/metadata";
import { publications } from "@/lib/publications";
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
