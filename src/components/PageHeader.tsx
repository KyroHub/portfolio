import type { ReactNode } from "react";
import { Badge } from "@/components/Badge";
import { cx } from "@/lib/classes";

type PageHeaderTone = "default" | "brand" | "sky" | "analytics";
type PageHeaderSize = "hero" | "page" | "compact";
type PageHeaderAlign = "center" | "left";
type EyebrowVariant = "text" | "badge";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  align?: PageHeaderAlign;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  eyebrowClassName?: string;
  eyebrowVariant?: EyebrowVariant;
  size?: PageHeaderSize;
  tone?: PageHeaderTone;
};

const TITLE_TONE_CLASSES: Record<PageHeaderTone, string> = {
  default: "from-stone-800 to-stone-500 dark:from-stone-100 dark:to-stone-400",
  brand: "from-sky-600 to-emerald-500 dark:from-sky-400 dark:to-emerald-400",
  sky: "from-sky-600 to-stone-500 dark:from-sky-400 dark:to-stone-400",
  analytics: "from-emerald-500 to-sky-600 dark:from-emerald-400 dark:to-sky-400",
};

const TITLE_SIZE_CLASSES: Record<PageHeaderSize, string> = {
  hero: "text-5xl md:text-7xl",
  page: "text-4xl md:text-6xl",
  compact: "text-4xl md:text-5xl",
};

export function PageHeader({
  title,
  description,
  eyebrow,
  align = "center",
  className,
  titleClassName,
  descriptionClassName,
  eyebrowClassName,
  eyebrowVariant = "text",
  size = "page",
  tone = "default",
}: PageHeaderProps) {
  const centered = align === "center";

  return (
    <div className={cx("space-y-4", centered ? "text-center" : "text-left", className)}>
      {eyebrow && (
        eyebrowVariant === "badge" ? (
          <Badge
            tone="accent"
            size="xs"
            caps
            className={cx(centered && "mx-auto", eyebrowClassName)}
          >
            {eyebrow}
          </Badge>
        ) : (
          <span
            className={cx(
              "text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400",
              centered && "mx-auto",
              eyebrowClassName
            )}
          >
            {eyebrow}
          </span>
        )
      )}

      <h1
        className={cx(
          "bg-gradient-to-tr bg-clip-text pb-2 font-extrabold tracking-tight text-transparent drop-shadow-sm",
          TITLE_SIZE_CLASSES[size],
          TITLE_TONE_CLASSES[tone],
          titleClassName
        )}
      >
        {title}
      </h1>

      {description && (
        <p
          className={cx(
            "text-lg font-medium text-stone-500 dark:text-stone-400 md:text-xl",
            centered ? "mx-auto max-w-3xl" : "max-w-3xl",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
