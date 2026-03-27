"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";

export type OptionalAuthGateStatus =
  | "loading"
  | "signed-in"
  | "signed-out"
  | "unavailable";

export function useOptionalAuthGate() {
  const authAvailable = hasSupabaseEnv();
  const [status, setStatus] = useState<OptionalAuthGateStatus>(
    authAvailable ? "loading" : "unavailable",
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!authAvailable) {
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      return;
    }

    let isMounted = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      const nextUser = data.user ?? null;
      setUser(nextUser);
      setStatus(nextUser ? "signed-in" : "signed-out");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStatus(session?.user ? "signed-in" : "signed-out");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [authAvailable]);

  return {
    authAvailable,
    isAuthenticated: status === "signed-in",
    isReady: status !== "loading",
    status,
    user,
  };
}
