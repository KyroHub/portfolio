import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

export type ProfileRow = Tables<"profiles">;
export type SubmissionRow = Tables<"submissions">;
export type SubmissionInsert = TablesInsert<"submissions">;
export type SubmissionUpdate = TablesUpdate<"submissions">;

export type ProfileRole = ProfileRow["role"];
export type SubmissionStatus = SubmissionRow["status"];

export type AdminSubmission = SubmissionRow & {
  studentEmail: string | null;
};
