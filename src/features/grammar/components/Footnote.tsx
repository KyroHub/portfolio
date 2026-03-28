"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cx } from "@/lib/classes";
import { FloatingTooltip } from "@/components/FloatingTooltip";
import { useGrammarLessonRenderContext } from "./GrammarLessonRenderContext";

type FootnoteAlign = "center" | "left" | "right";

type FootnoteProps = {
  number: number;
  content: ReactNode;
  align?: FootnoteAlign;
};

export function Footnote({
  number,
  content,
  align = "center",
}: FootnoteProps) {
  const { registerFootnote, renderMode } = useGrammarLessonRenderContext();
  const tooltipId = useId();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    registerFootnote({ content, number });
  }, [content, number, registerFootnote]);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openTooltip = () => {
    clearCloseTimeout();
    setIsOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 80);
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateHoverCapability = () => {
      setCanHover(mediaQuery.matches);
    };

    updateHoverCapability();
    mediaQuery.addEventListener("change", updateHoverCapability);

    return () => {
      mediaQuery.removeEventListener("change", updateHoverCapability);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (
        anchorRef.current?.contains(target) ||
        tooltipRef.current?.contains(target)
      ) {
        return;
      }

      clearCloseTimeout();
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearCloseTimeout();
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, []);

  const handleClick = () => {
    if (renderMode === "pdf") {
      return;
    }

    if (canHover) {
      openTooltip();
      return;
    }

    setIsOpen((current) => {
      if (current) {
        return false;
      }

      return true;
    });
  };

  const tooltip =
    renderMode === "web" ? (
      <FloatingTooltip
        align={align}
        anchorRef={anchorRef}
        arrowClassName="bg-black"
        className={cx(
          "max-w-[min(18rem,calc(100vw-1.5rem))] rounded-xl bg-black px-3 py-2.5 text-left text-xs leading-relaxed text-white shadow-2xl",
          "[&_p]:text-white [&_li]:text-white [&_strong]:text-white [&_em]:text-white [&_.small-caps]:text-white",
          "[&_a]:text-sky-200 [&_a]:decoration-sky-400 [&_a:hover]:text-sky-100",
          "[&_.font-coptic]:text-emerald-300 [&_sup]:text-white",
        )}
        id={tooltipId}
        isOpen={isOpen}
        onMouseEnter={canHover ? openTooltip : undefined}
        onMouseLeave={canHover ? scheduleClose : undefined}
        tooltipRef={tooltipRef}
        withArrow
      >
        {content}
      </FloatingTooltip>
    ) : null;

  return (
    <>
      <sup className="ml-0.5 align-super">
        {renderMode === "pdf" ? (
          <span className="inline-flex rounded-sm font-bold text-sky-600 dark:text-sky-400">
            [{number}]
          </span>
        ) : (
          <button
            ref={anchorRef}
            type="button"
            aria-describedby={isOpen ? tooltipId : undefined}
            aria-expanded={isOpen}
            className="inline-flex cursor-help rounded-sm font-bold text-sky-600 outline-none transition-colors hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500/35 dark:text-sky-400 dark:hover:text-sky-300"
            onClick={handleClick}
            onFocus={openTooltip}
            onBlur={canHover ? scheduleClose : undefined}
            onMouseEnter={canHover ? openTooltip : undefined}
            onMouseLeave={canHover ? scheduleClose : undefined}
          >
            [{number}]
          </button>
        )}
      </sup>
      {tooltip}
    </>
  );
}
