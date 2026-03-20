"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function EntryPageHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
      <Link href="/dictionary" className="btn-secondary gap-2 px-4">
        <ArrowLeft className="h-4 w-4" />
        {t("entry.back")}
      </Link>

      <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
        {t("entry.badge")}
      </span>
    </div>
  );
}
