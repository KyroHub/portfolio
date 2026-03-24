"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedServerContext } from "@/lib/supabase/auth";
import { hasSupabaseRuntimeEnv } from "@/lib/supabase/config";

export async function updateProfile(formData: FormData) {
  if (!hasSupabaseRuntimeEnv()) {
    return { success: false, error: "Supabase environment missing." };
  }

  const authContext = await getAuthenticatedServerContext();
  if (!authContext) {
    return { success: false, error: "You must be logged in." };
  }
  const { supabase, user } = authContext;

  const fullName = formData.get("full_name") as string | null;
  const avatarUrl = formData.get("avatar_url") as string | null;

  // Ensure users only update the fields permitted (full_name and avatar_url)
  // RLS database rules prevent role manipulation anyway, but avoiding it in the payload is cleaner.
  const updates = {
    ...(fullName !== null && { full_name: fullName }),
    ...(avatarUrl !== null && { avatar_url: avatarUrl }),
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
