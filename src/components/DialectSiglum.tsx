"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { getDialectLabelKey } from "@/lib/dialects";

type DialectSiglumProps = {
  siglum?: string;
};

export default function DialectSiglum({ siglum }: DialectSiglumProps) {
  const { t } = useLanguage();

  if (!siglum) {
    return null;
  }

  const labelKey = getDialectLabelKey(siglum);
  const fullName = labelKey ? t(labelKey) : siglum;
  const tooltip = fullName === siglum ? siglum : `${fullName} (${siglum})`;
  const sharedProps = {
    "aria-label": tooltip,
    className: "group/tooltip relative inline-flex items-center leading-none cursor-help whitespace-nowrap focus:outline-none",
    tabIndex: 0,
  };

  const tooltipBubble = (
    <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-max max-w-64 -translate-x-1/2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-center text-[11px] font-medium normal-case tracking-normal text-stone-700 shadow-lg group-hover/tooltip:block group-focus-visible/tooltip:block dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">
      {tooltip}
    </span>
  );

  if (siglum.length === 2 && /^[A-Z][abf]$/.test(siglum)) {
    return (
      <span {...sharedProps}>
        {siglum[0]}
        <sup className="ml-0.5 align-super text-[0.7em] italic font-normal">
          {siglum[1]}
        </sup>
        {tooltipBubble}
      </span>
    );
  }

  return (
    <span {...sharedProps}>
      {siglum}
      {tooltipBubble}
    </span>
  );
}
