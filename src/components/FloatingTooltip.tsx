"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "@/lib/classes";

export type FloatingTooltipAlign = "center" | "left" | "right";
type FloatingTooltipPlacement = "top" | "bottom";

type FloatingTooltipPosition = {
  arrowLeft: number;
  left: number;
  placement: FloatingTooltipPlacement;
  top: number;
};

type FloatingTooltipProps = {
  align?: FloatingTooltipAlign;
  anchorRef: RefObject<HTMLElement | null>;
  arrowClassName?: string;
  className?: string;
  children: ReactNode;
  id?: string;
  isOpen: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  role?: string;
  tooltipRef?: RefObject<HTMLDivElement | null>;
  withArrow?: boolean;
};

const VIEWPORT_PADDING = 12;
const TOOLTIP_GAP = 10;
const ARROW_OFFSET = 6;
const ARROW_SAFE_PADDING = 16;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function FloatingTooltip({
  align = "center",
  anchorRef,
  arrowClassName,
  children,
  className,
  id,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  role = "tooltip",
  tooltipRef,
  withArrow = false,
}: FloatingTooltipProps) {
  const internalTooltipRef = useRef<HTMLDivElement | null>(null);
  const resolvedTooltipRef = tooltipRef ?? internalTooltipRef;
  const [position, setPosition] = useState<FloatingTooltipPosition | null>(null);

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current || !resolvedTooltipRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!anchorRef.current || !resolvedTooltipRef.current) {
        return;
      }

      const anchorRect = anchorRef.current.getBoundingClientRect();
      const tooltipRect = resolvedTooltipRef.current.getBoundingClientRect();
      const anchorCenter = anchorRect.left + anchorRect.width / 2;
      const maxLeft = Math.max(
        VIEWPORT_PADDING,
        window.innerWidth - tooltipRect.width - VIEWPORT_PADDING,
      );

      const idealLeft =
        align === "left"
          ? anchorRect.left
          : align === "right"
            ? anchorRect.right - tooltipRect.width
            : anchorCenter - tooltipRect.width / 2;

      const left = clamp(idealLeft, VIEWPORT_PADDING, maxLeft);
      const topPlacement = anchorRect.top - tooltipRect.height - TOOLTIP_GAP;
      const bottomPlacement = anchorRect.bottom + TOOLTIP_GAP;

      let placement: FloatingTooltipPlacement = "top";
      let top = topPlacement;

      if (topPlacement < VIEWPORT_PADDING) {
        placement = "bottom";
        top = bottomPlacement;
      }

      if (placement === "bottom") {
        top = Math.min(
          bottomPlacement,
          window.innerHeight - tooltipRect.height - VIEWPORT_PADDING,
        );
      } else {
        top = Math.max(topPlacement, VIEWPORT_PADDING);
      }

      const arrowLeft = clamp(
        anchorCenter - left,
        ARROW_SAFE_PADDING,
        tooltipRect.width - ARROW_SAFE_PADDING,
      );

      setPosition({
        arrowLeft,
        left,
        placement,
        top,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, anchorRef, isOpen, resolvedTooltipRef]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      ref={resolvedTooltipRef}
      id={id}
      role={role}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cx(
        "fixed z-[80] opacity-0",
        position && "opacity-100",
        className,
      )}
      style={{
        left: position?.left ?? VIEWPORT_PADDING,
        top: position?.top ?? VIEWPORT_PADDING,
        visibility: position ? "visible" : "hidden",
      }}
    >
      {children}
      {withArrow ? (
        <span
          className={cx(
            "absolute h-3 w-3 rotate-45",
            position?.placement === "bottom"
              ? "bottom-full mb-[-6px]"
              : "top-full mt-[-6px]",
            arrowClassName,
          )}
          style={{
            left: (position?.arrowLeft ?? ARROW_SAFE_PADDING) - ARROW_OFFSET,
          }}
        />
      ) : null}
    </div>,
    document.body,
  );
}
