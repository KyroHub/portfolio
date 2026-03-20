import type { HTMLAttributes } from "react";
import { cx } from "@/lib/classes";

type SurfacePanelVariant = "default" | "subtle" | "elevated";
type SurfacePanelShadow = "soft" | "panel";
type SurfacePanelRounded = "2xl" | "3xl";
type SurfacePanelTag = "article" | "div" | "section";

type SurfacePanelProps = HTMLAttributes<HTMLElement> & {
  as?: SurfacePanelTag;
  rounded?: SurfacePanelRounded;
  shadow?: SurfacePanelShadow;
  variant?: SurfacePanelVariant;
};

const VARIANT_CLASSES: Record<SurfacePanelVariant, string> = {
  default: "bg-white/70 dark:bg-stone-900/50",
  subtle: "bg-white/60 dark:bg-stone-900/60",
  elevated: "bg-white/75 dark:bg-stone-900/55",
};

const SHADOW_CLASSES: Record<SurfacePanelShadow, string> = {
  soft: "shadow-sm dark:shadow-lg",
  panel: "shadow-md dark:shadow-xl dark:shadow-black/20",
};

const ROUNDED_CLASSES: Record<SurfacePanelRounded, string> = {
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

export function SurfacePanel({
  as = "div",
  className,
  rounded = "2xl",
  shadow = "panel",
  variant = "default",
  ...props
}: SurfacePanelProps) {
  const Component = as;

  return (
    <Component
      className={cx(
        "border border-stone-200 backdrop-blur-md dark:border-stone-800",
        VARIANT_CLASSES[variant],
        SHADOW_CLASSES[shadow],
        ROUNDED_CLASSES[rounded],
        className
      )}
      {...props}
    />
  );
}
