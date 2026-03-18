import React from "react";

export function Footnote({ 
  number, 
  content 
}: { 
  number: number; 
  content: React.ReactNode; 
}) {
  return (
    <sup className="relative group cursor-help text-sky-600 dark:text-sky-400 font-bold ml-0.5 z-10">
      [{number}]
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-stone-900 text-stone-100 dark:bg-stone-200 dark:text-stone-900 text-xs text-left leading-relaxed rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
        {content}
        {/* Triangle arrow */}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-stone-900 dark:border-t-stone-200"></span>
      </span>
    </sup>
  );
}
