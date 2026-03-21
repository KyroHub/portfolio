"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  consumeRateLimit,
  getClientRateLimitIdentifier,
} from "@/lib/rateLimit";
import {
  getAuthUnavailableLoginPath,
  hasSupabaseRuntimeEnv,
} from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site";
import {
  getFormString,
  hasLengthInRange,
  isValidEmail,
  normalizeWhitespace,
} from "@/lib/validation";

function getSafeRedirectTarget(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "/dashboard";
  }

  return value;
}

function getNormalizedEmail(formData: FormData) {
  return normalizeWhitespace(getFormString(formData, "email")).toLowerCase();
}

function getPassword(formData: FormData) {
  return getFormString(formData, "password");
}

export async function login(formData: FormData) {
  const redirectTo = getSafeRedirectTarget(formData.get("redirectTo"));
  const email = getNormalizedEmail(formData);
  const password = getPassword(formData);

  if (!hasSupabaseRuntimeEnv()) {
    redirect(getAuthUnavailableLoginPath(redirectTo));
  }

  if (
    !isValidEmail(email) ||
    !hasLengthInRange(password, { min: 1, max: 128 })
  ) {
    redirect(
      `/login?state=login-invalid-input&messageType=error&redirect_to=${encodeURIComponent(redirectTo)}`,
    );
  }

  const clientIdentifier = await getClientRateLimitIdentifier();
  const loginRateLimit = await consumeRateLimit({
    identifier: clientIdentifier,
    limit: 5,
    namespace: "auth:login",
    windowMs: 10 * 60 * 1000,
  });

  if (!loginRateLimit.ok) {
    redirect(
      `/login?state=login-rate-limited&messageType=error&redirect_to=${encodeURIComponent(redirectTo)}`,
    );
  }

  const supabase = await createClient();
  const data = {
    email,
    password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(
      `/login?state=login-error&messageType=error&redirect_to=${encodeURIComponent(redirectTo)}`,
    );
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signup(formData: FormData) {
  if (!hasSupabaseRuntimeEnv()) {
    redirect(getAuthUnavailableLoginPath());
  }

  const loginUrl = new URL(
    "/login",
    getSiteUrl()?.toString() ?? "https://kyrilloswannes.com",
  );
  loginUrl.searchParams.set("state", "signup-confirmed");
  loginUrl.searchParams.set("messageType", "success");
  const email = getNormalizedEmail(formData);
  const password = getPassword(formData);

  if (
    !isValidEmail(email) ||
    !hasLengthInRange(password, { min: 8, max: 128 })
  ) {
    redirect("/login?state=signup-invalid-input&messageType=error");
  }

  const clientIdentifier = await getClientRateLimitIdentifier();
  const signupRateLimit = await consumeRateLimit({
    identifier: clientIdentifier,
    limit: 3,
    namespace: "auth:signup",
    windowMs: 60 * 60 * 1000,
  });

  if (!signupRateLimit.ok) {
    redirect("/login?state=signup-rate-limited&messageType=error");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: loginUrl.toString(),
    },
  });

  if (error) {
    redirect("/login?state=signup-error&messageType=error");
  }

  if (!data.session) {
    redirect("/login?state=signup-check-email&messageType=success");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  if (!hasSupabaseRuntimeEnv()) {
    redirect(getAuthUnavailableLoginPath());
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  if (!hasSupabaseRuntimeEnv()) {
    redirect(getAuthUnavailableLoginPath());
  }

  const email = getNormalizedEmail(formData);
  if (!isValidEmail(email)) {
    redirect("/forgot-password?state=forgot-invalid-input&messageType=error");
  }

  const clientIdentifier = await getClientRateLimitIdentifier();
  const resetRateLimit = await consumeRateLimit({
    identifier: clientIdentifier,
    limit: 3,
    namespace: "auth:reset",
    windowMs: 60 * 60 * 1000,
  });

  if (!resetRateLimit.ok) {
    redirect("/forgot-password?state=forgot-rate-limited&messageType=error");
  }

  const supabase = await createClient();
  let baseUrl = getSiteUrl()?.toString() || "https://kyrilloswannes.com";
  if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/update-password`,
  });

  if (error) {
    redirect("/forgot-password?state=forgot-error&messageType=error");
  }

  redirect("/forgot-password?state=forgot-success&messageType=success");
}

export async function updatePassword(formData: FormData) {
  if (!hasSupabaseRuntimeEnv()) {
    redirect(getAuthUnavailableLoginPath());
  }

  const password = getPassword(formData);
  if (!hasLengthInRange(password, { min: 8, max: 128 })) {
    redirect("/update-password?state=update-invalid-input&messageType=error");
  }

  const clientIdentifier = await getClientRateLimitIdentifier();
  const updateRateLimit = await consumeRateLimit({
    identifier: clientIdentifier,
    limit: 5,
    namespace: "auth:update",
    windowMs: 60 * 60 * 1000,
  });

  if (!updateRateLimit.ok) {
    redirect("/update-password?state=update-rate-limited&messageType=error");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?state=login-error&messageType=error");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/update-password?state=update-error&messageType=error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signInWithGoogle() {
  if (!hasSupabaseRuntimeEnv()) {
    redirect(getAuthUnavailableLoginPath());
  }

  const supabase = await createClient();
  let baseUrl = getSiteUrl()?.toString() || "http://localhost:3000";
  if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error) {
    redirect("/login?state=login-error&messageType=error");
  }

  if (data?.url) {
    redirect(data.url);
  }

  redirect("/login?state=login-error&messageType=error");
}
