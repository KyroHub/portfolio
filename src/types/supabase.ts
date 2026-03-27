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
      entry_favorites: {
        Row: {
          created_at: string;
          entry_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          entry_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          entry_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["user_id"];
            foreignKeyName: "entry_favorites_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
      };
      entry_reports: {
        Row: {
          commentary: string;
          created_at: string;
          entry_headword: string;
          entry_id: string;
          id: string;
          reason: "grammar" | "other" | "relation" | "translation" | "typo";
          status: "dismissed" | "open" | "resolved" | "reviewed";
          user_id: string;
        };
        Insert: {
          commentary: string;
          created_at?: string;
          entry_headword: string;
          entry_id: string;
          id?: string;
          reason: "grammar" | "other" | "relation" | "translation" | "typo";
          status?: "dismissed" | "open" | "resolved" | "reviewed";
          user_id: string;
        };
        Update: {
          commentary?: string;
          created_at?: string;
          entry_headword?: string;
          entry_id?: string;
          id?: string;
          reason?: "grammar" | "other" | "relation" | "translation" | "typo";
          status?: "dismissed" | "open" | "resolved" | "reviewed";
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["user_id"];
            foreignKeyName: "entry_reports_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          role: "admin" | "student";
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          role?: "admin" | "student";
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          role?: "admin" | "student";
        };
        Relationships: [];
      };
      lesson_bookmarks: {
        Row: {
          created_at: string;
          lesson_id: string;
          lesson_slug: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          lesson_id: string;
          lesson_slug: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          lesson_id?: string;
          lesson_slug?: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["user_id"];
            foreignKeyName: "lesson_bookmarks_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
      };
      lesson_notes: {
        Row: {
          created_at: string;
          lesson_id: string;
          lesson_slug: string;
          note_text: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          lesson_id: string;
          lesson_slug: string;
          note_text: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          lesson_id?: string;
          lesson_slug?: string;
          note_text?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["user_id"];
            foreignKeyName: "lesson_notes_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
      };
      lesson_progress: {
        Row: {
          completed_at: string | null;
          last_viewed_at: string;
          lesson_id: string;
          lesson_slug: string;
          started_at: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          last_viewed_at?: string;
          lesson_id: string;
          lesson_slug: string;
          started_at?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          last_viewed_at?: string;
          lesson_id?: string;
          lesson_slug?: string;
          started_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["user_id"];
            foreignKeyName: "lesson_progress_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
      };
      section_progress: {
        Row: {
          completed_at: string;
          lesson_id: string;
          lesson_slug: string;
          section_id: string;
          section_slug: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          lesson_id: string;
          lesson_slug: string;
          section_id: string;
          section_slug: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          lesson_id?: string;
          lesson_slug?: string;
          section_id?: string;
          section_slug?: string;
          user_id?: string;
        };
        Relationships: [
          {
            columns: ["user_id"];
            foreignKeyName: "section_progress_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "profiles";
          },
        ];
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
