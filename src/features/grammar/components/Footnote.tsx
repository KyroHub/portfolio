import React from "react";

export function Footnote({ 
  number, 
  content,
  align = "center",
}: { 
  number: number; 
  content: React.ReactNode; 
  align?: "center" | "left" | "right";
}) {
  // Alignment drives both the tooltip body and the arrow so footnotes can sit
  // cleanly inside narrow tables as well as normal paragraph text.
  const tooltipPosition =
    align === "left"
      ? "left-0 translate-x-0"
      : align === "right"
        ? "right-0 translate-x-0"
        : "left-1/2 -translate-x-1/2";

  const arrowPosition =
    align === "left"
      ? "left-3 -translate-x-0"
      : align === "right"
        ? "right-3 translate-x-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <sup className="relative group cursor-help text-sky-600 dark:text-sky-400 font-bold ml-0.5 z-10">
      [{number}]
      <span className={`absolute bottom-full mb-2 w-64 p-3 bg-stone-900 text-stone-100 dark:bg-stone-200 dark:text-stone-900 text-xs text-left leading-relaxed rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 ${tooltipPosition}`}>
        {content}
        <span className={`absolute top-full -mt-1 border-[6px] border-transparent border-t-stone-900 dark:border-t-stone-200 ${arrowPosition}`}></span>
      </span>
    </sup>
  );
}
