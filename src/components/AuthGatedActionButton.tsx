"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Lock } from "lucide-react";
import { cx } from "@/lib/classes";

type AuthGatedActionButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  isAuthenticated: boolean;
  isReady: boolean;
  lockedContent?: ReactNode;
  lockedMessage: string;
  tooltipClassName?: string;
  wrapperClassName?: string;
};

export function AuthGatedActionButton({
  children,
  className,
  isAuthenticated,
  isReady,
  lockedContent,
  lockedMessage,
  tooltipClassName,
  type = "button",
  wrapperClassName,
  ...buttonProps
}: AuthGatedActionButtonProps) {
  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className={cx("group relative inline-block", wrapperClassName)}>
        <button
          type={type}
          disabled
          className={cx(className, "cursor-not-allowed opacity-50")}
        >
          {lockedContent ?? (
            <>
              <Lock className="h-4 w-4" />
              {children}
            </>
          )}
        </button>
        <div
          className={cx(
            "pointer-events-none absolute right-0 top-full z-50 mt-2 w-max max-w-xs rounded bg-stone-800 p-2 text-center text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100",
            tooltipClassName,
          )}
        >
          {lockedMessage}
        </div>
      </div>
    );
  }

  return (
    <button type={type} className={className} {...buttonProps}>
      {children}
    </button>
  );
}
