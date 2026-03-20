import type { ReactNode } from "react";
import { cx } from "@/lib/classes";
import { SurfacePanel } from "@/components/SurfacePanel";

type EmptyStateProps = {
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  title: ReactNode;
  titleClassName?: string;
};

export function EmptyState({
  children,
  className,
  description,
  descriptionClassName,
  title,
  titleClassName,
}: EmptyStateProps) {
  return (
    <SurfacePanel
      rounded="3xl"
      className={cx("px-6 py-20 text-center", className)}
    >
      <h3
        className={cx(
          "mb-2 text-2xl font-semibold text-stone-800 dark:text-stone-200",
          titleClassName
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cx(
            "font-medium text-stone-500 dark:text-stone-400",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}

      {children && <div className="mt-6">{children}</div>}
    </SurfacePanel>
  );
}
