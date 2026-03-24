"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/Badge";
import { BreadcrumbTrail } from "@/components/BreadcrumbTrail";
import { useLanguage } from "@/components/LanguageProvider";
import { getDictionaryPath, getLocalizedHomePath } from "@/lib/locale";

type EntryPageHeaderProps = {
  entryLabel: string;
};

export default function EntryPageHeader({ entryLabel }: EntryPageHeaderProps) {
  const { language, t } = useLanguage();

  return (
    <div className="mb-8 space-y-4">
      <BreadcrumbTrail
        items={[
          { label: t("nav.home"), href: getLocalizedHomePath(language) },
          { label: t("nav.dictionary"), href: getDictionaryPath(language) },
          { label: entryLabel, labelClassName: "font-coptic" },
        ]}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link href={getDictionaryPath(language)} className="btn-secondary gap-2 px-4">
          <ArrowLeft className="h-4 w-4" />
          {t("entry.back")}
        </Link>

        <Badge tone="accent" size="xs" caps>
          {t("entry.badge")}
        </Badge>
      </div>
    </div>
  );
}
