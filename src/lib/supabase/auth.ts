import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import {
  getAuthUnavailableLoginPath,
  getLoginPath,
  hasSupabaseRuntimeEnv,
} from "@/lib/supabase/config";
import {
  getAuthenticatedUser,
  getProfileRole,
  type AppSupabaseClient,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

type AuthenticatedServerContext = {
  supabase: AppSupabaseClient;
  user: User;
};

export async function getAuthenticatedServerContext(): Promise<AuthenticatedServerContext | null> {
  if (!hasSupabaseRuntimeEnv()) {
    return null;
  }

  const supabase = await createClient();
  const user = await getAuthenticatedUser(supabase);

  if (!user) {
    return null;
  }

  return { supabase, user };
}

export async function getAdminServerContext(): Promise<AuthenticatedServerContext | null> {
  const authContext = await getAuthenticatedServerContext();

  if (!authContext) {
    return null;
  }

  const role = await getProfileRole(authContext.supabase, authContext.user.id);
  return role === "admin" ? authContext : null;
}

export async function requireAuthenticatedPageSession(
  redirectTo: string,
): Promise<AuthenticatedServerContext> {
  if (!hasSupabaseRuntimeEnv()) {
    redirect(getAuthUnavailableLoginPath(redirectTo));
  }

  const authContext = await getAuthenticatedServerContext();

  if (!authContext) {
    redirect(getLoginPath(redirectTo));
  }

  return authContext;
}

export async function requireAdminPageSession(
  redirectTo = "/admin",
): Promise<AuthenticatedServerContext> {
  const authContext = await requireAuthenticatedPageSession(redirectTo);
  const role = await getProfileRole(authContext.supabase, authContext.user.id);

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return authContext;
}
