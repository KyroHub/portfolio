import type { ReactNode } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { SurfacePanel } from "@/components/SurfacePanel";
import { cx } from "@/lib/classes";

type RouteLoadingStateProps = {
  accents?: readonly string[];
  description: string;
  eyebrow?: string;
  panelClassName?: string;
  skeleton?: ReactNode;
  title: string;
  tone?: "default" | "brand" | "sky" | "analytics";
};

function LoadingBlock({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "animate-pulse rounded-2xl bg-stone-200/80 dark:bg-stone-800/80",
        className,
      )}
    />
  );
}

function DefaultLoadingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <SurfacePanel rounded="3xl" className="space-y-5 p-6 md:p-8">
        <LoadingBlock className="h-5 w-32" />
        <LoadingBlock className="h-12 w-3/4" />
        <LoadingBlock className="h-4 w-full" />
        <LoadingBlock className="h-4 w-5/6" />
        <div className="grid gap-4 md:grid-cols-2">
          <LoadingBlock className="h-28 w-full" />
          <LoadingBlock className="h-28 w-full" />
        </div>
      </SurfacePanel>

      <SurfacePanel rounded="3xl" variant="subtle" className="space-y-4 p-6 md:p-8">
        <LoadingBlock className="h-5 w-28" />
        <LoadingBlock className="h-20 w-full" />
        <LoadingBlock className="h-20 w-full" />
        <LoadingBlock className="h-12 w-2/3" />
      </SurfacePanel>
    </div>
  );
}

export function RouteLoadingState({
  accents,
  description,
  eyebrow,
  panelClassName,
  skeleton,
  title,
  tone = "default",
}: RouteLoadingStateProps) {
  return (
    <PageShell
      className="min-h-screen px-6 py-14 md:px-10"
      contentClassName={cx("mx-auto max-w-6xl space-y-10", panelClassName)}
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

      {skeleton ?? <DefaultLoadingSkeleton />}
    </PageShell>
  );
}
