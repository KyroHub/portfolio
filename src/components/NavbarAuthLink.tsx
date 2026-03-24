"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";

type NavbarAuthLinkProps = {
  dashboardLabel: string;
  loginLabel: string;
  onNavigate?: () => void;
  pathname: string;
  variant: "desktop" | "mobile";
};

function getLinkClasses(variant: NavbarAuthLinkProps["variant"], isActive: boolean) {
  if (variant === "mobile") {
    return {
      linkClassName: `group grid rounded-xl px-4 py-3 text-sm tracking-[0.02em] transition-colors before:invisible before:col-start-1 before:row-start-1 before:h-0 before:overflow-hidden before:font-semibold before:content-[attr(data-label)] ${
        isActive
          ? "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"
          : "text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900/60 dark:hover:text-stone-200"
      }`,
      labelClassName: `col-start-1 row-start-1 ${isActive ? "font-semibold" : "font-medium group-hover:font-semibold"}`,
    };
  }

  return {
    linkClassName: `group inline-grid h-10 items-center rounded-full px-4 text-sm tracking-[0.02em] transition-all duration-200 before:invisible before:col-start-1 before:row-start-1 before:h-0 before:overflow-hidden before:font-semibold before:content-[attr(data-label)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/25 ${
      isActive
        ? "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"
        : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
    }`,
    labelClassName: `col-start-1 row-start-1 ${isActive ? "font-semibold" : "font-medium group-hover:font-semibold"}`,
  };
}

export function NavbarAuthLink({
  dashboardLabel,
  loginLabel,
  onNavigate,
  pathname,
  variant,
}: NavbarAuthLinkProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      return;
    }

    let isMounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setUser(data.session?.user ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const href = user ? "/dashboard" : "/login";
  const label = user ? dashboardLabel : loginLabel;
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  const { linkClassName, labelClassName } = getLinkClasses(variant, isActive);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      data-label={label}
      className={linkClassName}
    >
      <span className={labelClassName}>{label}</span>
    </Link>
  );
}
