import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import DictionaryPageClient from "@/components/DictionaryPageClient";
import { createPageMetadata } from "@/lib/metadata";
import { createDictionaryPageStructuredData } from "@/lib/structuredData";

export const metadata: Metadata = createPageMetadata({
  title: "Coptic Dictionary",
  description:
    "Search the Coptic-English dictionary by Coptic, English, or Greek, with dialect filters, grammatical detail, and a built-in virtual keyboard.",
  path: "/dictionary",
});

export default function DictionaryPage() {
  return (
    <>
      <StructuredData data={createDictionaryPageStructuredData()} />
      <DictionaryPageClient />
    </>
  );
}
