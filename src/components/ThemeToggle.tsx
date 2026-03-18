"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 p-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 flex items-center justify-center pointer-events-none">
        <div className="w-5 h-5 bg-stone-300 dark:bg-stone-700 rounded-full animate-pulse" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 p-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center group shadow-sm text-stone-600 dark:text-stone-400"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:text-amber-500" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:text-sky-400" />
    </button>
  );
}
