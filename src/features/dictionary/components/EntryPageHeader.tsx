"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/Badge";
import { useLanguage } from "@/components/LanguageProvider";

export default function EntryPageHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
      <Link href="/dictionary" className="btn-secondary gap-2 px-4">
        <ArrowLeft className="h-4 w-4" />
        {t("entry.back")}
      </Link>

      <Badge tone="accent" size="xs" caps>
        {t("entry.badge")}
      </Badge>
    </div>
  );
}
