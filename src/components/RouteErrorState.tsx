"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { StatusNotice } from "@/components/StatusNotice";
import { SurfacePanel } from "@/components/SurfacePanel";
import { cx } from "@/lib/classes";

type RouteErrorStateProps = {
  accents?: readonly string[];
  description: string;
  details?: ReactNode;
  eyebrow?: string;
  panelClassName?: string;
  primaryHref?: string;
  primaryLabel?: string;
  reset?: () => void;
  retryLabel?: string;
  title: string;
  tone?: "default" | "brand" | "sky" | "analytics";
};

export function RouteErrorState({
  accents,
  description,
  details,
  eyebrow,
  panelClassName,
  primaryHref,
  primaryLabel,
  reset,
  retryLabel = "Try again",
  title,
  tone = "default",
}: RouteErrorStateProps) {
  return (
    <PageShell
      className="min-h-screen px-6 py-14 md:px-10"
      contentClassName={cx("mx-auto max-w-4xl space-y-8", panelClassName)}
      accents={accents}
    >
      <PageHeader
        eyebrow={eyebrow}
        eyebrowVariant={eyebrow ? "badge" : "text"}
        title={title}
        description={description}
        tone={tone}
        size="compact"
        align="left"
      />

      <SurfacePanel rounded="3xl" className="space-y-6 p-6 md:p-8">
        <StatusNotice
          tone="error"
          size="comfortable"
          align="left"
          title="Something interrupted this page"
        >
          {details ?? "Please try loading the page again. If the issue continues, come back in a moment."}
        </StatusNotice>

        <div className="flex flex-wrap gap-3">
          {reset ? (
            <button type="button" onClick={reset} className="btn-primary">
              {retryLabel}
            </button>
          ) : null}
          {primaryHref && primaryLabel ? (
            <Link href={primaryHref} className="btn-secondary">
              {primaryLabel}
            </Link>
          ) : null}
        </div>
      </SurfacePanel>
    </PageShell>
  );
}
