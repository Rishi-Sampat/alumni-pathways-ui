export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alumni_phone_dataset: {
        Row: {
          created_at: string | null
          department: string
          first_name: string
          graduation_year: number
          id: string
          is_used: boolean | null
          last_name: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          department: string
          first_name: string
          graduation_year: number
          id?: string
          is_used?: boolean | null
          last_name: string
          phone: string
        }
        Update: {
          created_at?: string | null
          department?: string
          first_name?: string
          graduation_year?: number
          id?: string
          is_used?: boolean | null
          last_name?: string
          phone?: string
        }
        Relationships: []
      }
      alumni_profiles: {
        Row: {
          achievements: string[] | null
          bio: string | null
          created_at: string | null
          current_company: string | null
          current_position: string | null
          department: string
          domains: string[] | null
          graduation_year: number
          id: string
          interests: string[] | null
          linkedin_url: string | null
          location: string | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string | null
          current_company?: string | null
          current_position?: string | null
          department: string
          domains?: string[] | null
          graduation_year: number
          id?: string
          interests?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          achievements?: string[] | null
          bio?: string | null
          created_at?: string | null
          current_company?: string | null
          current_position?: string | null
          department?: string
          domains?: string[] | null
          graduation_year?: number
          id?: string
          interests?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          attachment_url: string | null
          content: string
          created_at: string | null
          doubt_id: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          created_at?: string | null
          doubt_id?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          doubt_id?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_doubt_id_fkey"
            columns: ["doubt_id"]
            isOneToOne: false
            referencedRelation: "doubts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doubts: {
        Row: {
          assigned_alumni_id: string | null
          created_at: string | null
          description: string
          domain_tags: string[]
          feedback: string | null
          id: string
          rating: number | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["doubt_status"] | null
          student_id: string
          title: string
          updated_at: string | null
          urgency: Database["public"]["Enums"]["doubt_urgency"] | null
        }
        Insert: {
          assigned_alumni_id?: string | null
          created_at?: string | null
          description: string
          domain_tags: string[]
          feedback?: string | null
          id?: string
          rating?: number | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["doubt_status"] | null
          student_id: string
          title: string
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["doubt_urgency"] | null
        }
        Update: {
          assigned_alumni_id?: string | null
          created_at?: string | null
          description?: string
          domain_tags?: string[]
          feedback?: string | null
          id?: string
          rating?: number | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["doubt_status"] | null
          student_id?: string
          title?: string
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["doubt_urgency"] | null
        }
        Relationships: [
          {
            foreignKeyName: "doubts_assigned_alumni_id_fkey"
            columns: ["assigned_alumni_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doubts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          current_attendees: number | null
          description: string
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          max_attendees: number | null
          organizer_id: string
          registration_deadline: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_attendees?: number | null
          description: string
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          max_attendees?: number | null
          organizer_id: string
          registration_deadline?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_attendees?: number | null
          description?: string
          event_date?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          max_attendees?: number | null
          organizer_id?: string
          registration_deadline?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      file_uploads: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          uploader_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          uploader_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_points: {
        Row: {
          action: string
          created_at: string | null
          domain: string | null
          doubt_id: string | null
          event_id: string | null
          id: string
          opportunity_id: string | null
          points: number
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          domain?: string | null
          doubt_id?: string | null
          event_id?: string | null
          id?: string
          opportunity_id?: string | null
          points: number
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          domain?: string | null
          doubt_id?: string | null
          event_id?: string | null
          id?: string
          opportunity_id?: string | null
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_points_doubt_id_fkey"
            columns: ["doubt_id"]
            isOneToOne: false
            referencedRelation: "doubts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_points_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_points_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          application_url: string | null
          company_name: string
          created_at: string | null
          deadline: string | null
          description: string
          id: string
          is_active: boolean | null
          location: string | null
          posted_by: string
          requirements: string[] | null
          skills_required: string[] | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at: string | null
        }
        Insert: {
          application_url?: string | null
          company_name: string
          created_at?: string | null
          deadline?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by: string
          requirements?: string[] | null
          skills_required?: string[] | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string | null
        }
        Update: {
          application_url?: string | null
          company_name?: string
          created_at?: string | null
          deadline?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string
          requirements?: string[] | null
          skills_required?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          attempts: number | null
          created_at: string | null
          expires_at: string
          id: string
          is_verified: boolean | null
          otp_code: string
          phone: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          expires_at: string
          id?: string
          is_verified?: boolean | null
          otp_code: string
          phone: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string
          id?: string
          is_verified?: boolean | null
          otp_code?: string
          phone?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_name: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      student_enrollment_dataset: {
        Row: {
          college_email: string
          created_at: string | null
          department: string
          enrollment_number: string
          first_name: string
          id: string
          is_used: boolean | null
          last_name: string
          semester: number
        }
        Insert: {
          college_email: string
          created_at?: string | null
          department: string
          enrollment_number: string
          first_name: string
          id?: string
          is_used?: boolean | null
          last_name: string
          semester: number
        }
        Update: {
          college_email?: string
          created_at?: string | null
          department?: string
          enrollment_number?: string
          first_name?: string
          id?: string
          is_used?: boolean | null
          last_name?: string
          semester?: number
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          created_at: string | null
          department: string
          enrollment_number: string
          id: string
          interests: string[] | null
          portfolio_url: string | null
          profile_id: string
          resume_url: string | null
          semester: number
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          enrollment_number: string
          id?: string
          interests?: string[] | null
          portfolio_url?: string | null
          profile_id: string
          resume_url?: string | null
          semester: number
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          enrollment_number?: string
          id?: string
          interests?: string[] | null
          portfolio_url?: string | null
          profile_id?: string
          resume_url?: string | null
          semester?: number
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          action_name: string
          domain_name?: string
          points_amount: number
          related_doubt_id?: string
          related_event_id?: string
          related_opportunity_id?: string
          user_uuid: string
        }
        Returns: undefined
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_alumni: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_student: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      doubt_status: "open" | "assigned" | "in_progress" | "resolved"
      doubt_urgency: "low" | "medium" | "high"
      event_type:
        | "networking"
        | "workshop"
        | "seminar"
        | "career_fair"
        | "meetup"
      opportunity_type: "internship" | "job" | "volunteering"
      user_role: "admin" | "alumni" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      doubt_status: ["open", "assigned", "in_progress", "resolved"],
      doubt_urgency: ["low", "medium", "high"],
      event_type: [
        "networking",
        "workshop",
        "seminar",
        "career_fair",
        "meetup",
      ],
      opportunity_type: ["internship", "job", "volunteering"],
      user_role: ["admin", "alumni", "student"],
    },
  },
} as const
