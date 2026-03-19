import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import HomePageClient from "@/components/HomePageClient";
import { createWebSiteStructuredData } from "@/lib/structuredData";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <StructuredData data={createWebSiteStructuredData()} />
      <HomePageClient />
    </>
  );
}
