"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
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
  const tooltipId = useId();
  const hideTimerRef = useRef<number | null>(null);
  const [isHoveringLockedButton, setIsHoveringLockedButton] = useState(false);
  const [isLockedMessageVisible, setIsLockedMessageVisible] = useState(false);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    const tooltipVisible = isHoveringLockedButton || isLockedMessageVisible;

    const showLockedMessage = () => {
      setIsLockedMessageVisible(true);

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }

      hideTimerRef.current = window.setTimeout(() => {
        setIsLockedMessageVisible(false);
        hideTimerRef.current = null;
      }, 2400);
    };

    return (
      <div className={cx("group relative inline-block", wrapperClassName)}>
        <button
          type={type}
          aria-describedby={tooltipVisible ? tooltipId : undefined}
          data-locked="true"
          className={cx(className, "cursor-not-allowed opacity-50")}
          onClick={(event) => {
            event.preventDefault();
            showLockedMessage();
          }}
          onMouseEnter={() => setIsHoveringLockedButton(true)}
          onMouseLeave={() => setIsHoveringLockedButton(false)}
        >
          {lockedContent ?? (
            <>
              <Lock className="h-4 w-4" />
              {children}
            </>
          )}
        </button>
        {tooltipVisible ? (
          <div
            id={tooltipId}
            role="tooltip"
            className={cx(
              "pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-stone-700 bg-stone-900/95 px-3 py-2 text-center text-xs leading-5 text-white shadow-lg",
              tooltipClassName,
            )}
          >
            {lockedMessage}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button type={type} className={className} {...buttonProps}>
      {children}
    </button>
  );
}
