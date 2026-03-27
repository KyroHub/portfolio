"use server";

import { revalidatePath } from "next/cache";
import {
  MAX_PROFILE_FULL_NAME_LENGTH,
  getAvatarStorageObjectPath,
  isValidProfileFullName,
  normalizeProfileFullName,
} from "@/features/profile/lib/profileValidation";
import { PUBLIC_LOCALES, getDashboardPath } from "@/lib/locale";
import { getAuthenticatedServerContext } from "@/lib/supabase/auth";
import {
  getSupabaseRuntimeEnv,
  hasSupabaseRuntimeEnv,
} from "@/lib/supabase/config";

export async function updateProfile(formData: FormData) {
  if (!hasSupabaseRuntimeEnv()) {
    return { success: false, error: "Supabase environment missing." };
  }

  const supabaseEnv = getSupabaseRuntimeEnv();
  if (!supabaseEnv) {
    return { success: false, error: "Supabase environment missing." };
  }

  const authContext = await getAuthenticatedServerContext();
  if (!authContext) {
    return { success: false, error: "You must be logged in." };
  }
  const { supabase, user } = authContext;

  let storageOrigin: string;
  try {
    storageOrigin = new URL(supabaseEnv.url).origin;
  } catch {
    return { success: false, error: "Supabase environment missing." };
  }

  const rawFullName = formData.get("full_name");
  const rawAvatarUrl = formData.get("avatar_url");

  let fullName: string | null | undefined;
  if (rawFullName !== null) {
    if (typeof rawFullName !== "string") {
      return { success: false, error: "Full name is invalid." };
    }

    fullName = normalizeProfileFullName(rawFullName);
    if (!isValidProfileFullName(fullName)) {
      return {
        success: false,
        error: `Full name must be ${MAX_PROFILE_FULL_NAME_LENGTH} characters or fewer.`,
      };
    }
  }

  let avatarUrl: string | null | undefined;
  if (rawAvatarUrl !== null) {
    if (typeof rawAvatarUrl !== "string") {
      return { success: false, error: "Avatar URL is invalid." };
    }

    const trimmedAvatarUrl = rawAvatarUrl.trim();

    if (!trimmedAvatarUrl) {
      avatarUrl = null;
    } else if (
      !getAvatarStorageObjectPath(trimmedAvatarUrl, {
        storageOrigin,
        userId: user.id,
      })
    ) {
      return { success: false, error: "Avatar URL is invalid." };
    } else {
      avatarUrl = trimmedAvatarUrl;
    }
  }

  // Ensure users only update the fields permitted (full_name and avatar_url)
  // RLS database rules prevent role manipulation anyway, but avoiding it in the payload is cleaner.
  const updates = {
    ...(fullName !== undefined && { full_name: fullName }),
    ...(avatarUrl !== undefined && { avatar_url: avatarUrl }),
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  for (const locale of PUBLIC_LOCALES) {
    revalidatePath(getDashboardPath(locale));
  }
  return { success: true };
}
