export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          role: "admin" | "student";
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id: string;
          role?: "admin" | "student";
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          role?: "admin" | "student";
        };
        Relationships: [];
      };
      submissions: {
        Row: {
          created_at: string;
          feedback_text: string | null;
          id: string;
          lesson_slug: string;
          rating: number | null;
          status: "pending" | "reviewed";
          submitted_text: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          feedback_text?: string | null;
          id?: string;
          lesson_slug: string;
          rating?: number | null;
          status?: "pending" | "reviewed";
          submitted_text: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          feedback_text?: string | null;
          id?: string;
          lesson_slug?: string;
          rating?: number | null;
          status?: "pending" | "reviewed";
          submitted_text?: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["user_id"];
            foreignKeyName: "submissions_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Row"];

export type TablesInsert<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Insert"];

export type TablesUpdate<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Update"];
