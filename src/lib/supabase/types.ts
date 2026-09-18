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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          auth_user_id: string
          created_at: string
          role: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          role?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          role?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_auth_user_id: string | null
          created_at: string
          id: number
          metadata: Json
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          actor_auth_user_id?: string | null
          created_at?: string
          id?: never
          metadata?: Json
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          actor_auth_user_id?: string | null
          created_at?: string
          id?: never
          metadata?: Json
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      club_subscribers: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          provider_synced_at: string | null
          status: Database["public"]["Enums"]["subscriber_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          provider_synced_at?: string | null
          status?: Database["public"]["Enums"]["subscriber_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          provider_synced_at?: string | null
          status?: Database["public"]["Enums"]["subscriber_status"]
          updated_at?: string
        }
        Relationships: []
      }
      consent_events: {
        Row: {
          action: Database["public"]["Enums"]["consent_action"]
          consent_text: string
          consent_type: string
          consent_version: string
          created_at: string
          id: number
          ip_address: unknown
          source_slug: string | null
          subscriber_id: string
          user_agent: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["consent_action"]
          consent_text: string
          consent_type?: string
          consent_version: string
          created_at?: string
          id?: never
          ip_address?: unknown
          source_slug?: string | null
          subscriber_id: string
          user_agent?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["consent_action"]
          consent_text?: string
          consent_type?: string
          consent_version?: string
          created_at?: string
          id?: never
          ip_address?: unknown
          source_slug?: string | null
          subscriber_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consent_events_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "club_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          ends_on: string
          id: string
          name: string
          slug: string
          starts_on: string
          status: Database["public"]["Enums"]["event_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_on: string
          id?: string
          name: string
          slug: string
          starts_on: string
          status?: Database["public"]["Enums"]["event_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_on?: string
          id?: string
          name?: string
          slug?: string
          starts_on?: string
          status?: Database["public"]["Enums"]["event_status"]
          updated_at?: string
        }
        Relationships: []
      }
      interests: {
        Row: {
          active: boolean
          created_at: string
          display_order: number
          id: string
          label: string
          slug: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_order?: number
          id?: string
          label: string
          slug: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          slug?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          benefits: string[]
          created_at: string
          display_order: number
          id: string
          name: string
          threshold: number
        }
        Insert: {
          benefits?: string[]
          created_at?: string
          display_order?: number
          id?: string
          name: string
          threshold: number
        }
        Update: {
          benefits?: string[]
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          threshold?: number
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          closes_at: string | null
          created_at: string
          created_by: string | null
          description: string
          event_id: string | null
          id: string
          min_stamp_threshold: number
          opens_at: string | null
          requires_good_standing: boolean
          status: Database["public"]["Enums"]["opportunity_status"]
          title: string
          updated_at: string
        }
        Insert: {
          closes_at?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          event_id?: string | null
          id?: string
          min_stamp_threshold?: number
          opens_at?: string | null
          requires_good_standing?: boolean
          status?: Database["public"]["Enums"]["opportunity_status"]
          title: string
          updated_at?: string
        }
        Update: {
          closes_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          event_id?: string | null
          id?: string
          min_stamp_threshold?: number
          opens_at?: string | null
          requires_good_standing?: boolean
          status?: Database["public"]["Enums"]["opportunity_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_submissions: {
        Row: {
          id: string
          note: string | null
          opportunity_id: string
          status: Database["public"]["Enums"]["submission_status"]
          submitted_at: string
          updated_at: string
          vendor_profile_id: string
        }
        Insert: {
          id?: string
          note?: string | null
          opportunity_id: string
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string
          updated_at?: string
          vendor_profile_id: string
        }
        Update: {
          id?: string
          note?: string | null
          opportunity_id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string
          updated_at?: string
          vendor_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_submissions_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_submissions_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_passport_summary"
            referencedColumns: ["vendor_profile_id"]
          },
          {
            foreignKeyName: "opportunity_submissions_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_challenge_events: {
        Row: {
          challenge_id: string
          event_id: string
        }
        Insert: {
          challenge_id: string
          event_id: string
        }
        Update: {
          challenge_id?: string
          event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "passport_challenge_events_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "passport_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_challenge_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_challenges: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          id: string
          reward_stamp_id: string | null
          status: Database["public"]["Enums"]["challenge_status"]
          updated_at: string
          vendor_profile_id: string
          voided_reason: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          reward_stamp_id?: string | null
          status?: Database["public"]["Enums"]["challenge_status"]
          updated_at?: string
          vendor_profile_id: string
          voided_reason?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          reward_stamp_id?: string | null
          status?: Database["public"]["Enums"]["challenge_status"]
          updated_at?: string
          vendor_profile_id?: string
          voided_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "passport_challenges_reward_stamp_id_fkey"
            columns: ["reward_stamp_id"]
            isOneToOne: false
            referencedRelation: "passport_stamps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_challenges_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_passport_summary"
            referencedColumns: ["vendor_profile_id"]
          },
          {
            foreignKeyName: "passport_challenges_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_stamps: {
        Row: {
          awarded_at: string
          awarded_by: string | null
          created_at: string
          event_id: string
          id: string
          note: string | null
          stamp_type: Database["public"]["Enums"]["stamp_type"]
          vendor_profile_id: string
          void_reason: string | null
          voided_at: string | null
          voided_by: string | null
        }
        Insert: {
          awarded_at?: string
          awarded_by?: string | null
          created_at?: string
          event_id: string
          id?: string
          note?: string | null
          stamp_type?: Database["public"]["Enums"]["stamp_type"]
          vendor_profile_id: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Update: {
          awarded_at?: string
          awarded_by?: string | null
          created_at?: string
          event_id?: string
          id?: string
          note?: string | null
          stamp_type?: Database["public"]["Enums"]["stamp_type"]
          vendor_profile_id?: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "passport_stamps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_stamps_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_passport_summary"
            referencedColumns: ["vendor_profile_id"]
          },
          {
            foreignKeyName: "passport_stamps_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      signup_sources: {
        Row: {
          active: boolean
          created_at: string
          id: string
          label: string
          slug: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          label: string
          slug: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          label?: string
          slug?: string
        }
        Relationships: []
      }
      subscriber_interests: {
        Row: {
          created_at: string
          interest_id: string
          subscriber_id: string
        }
        Insert: {
          created_at?: string
          interest_id: string
          subscriber_id: string
        }
        Update: {
          created_at?: string
          interest_id?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriber_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriber_interests_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "club_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriber_source_touches: {
        Row: {
          created_at: string
          id: number
          source_slug: string
          subscriber_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          source_slug: string
          subscriber_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          source_slug?: string
          subscriber_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriber_source_touches_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "club_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_categories: {
        Row: {
          interest_id: string
          vendor_profile_id: string
        }
        Insert: {
          interest_id: string
          vendor_profile_id: string
        }
        Update: {
          interest_id?: string
          vendor_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_categories_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_categories_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_passport_summary"
            referencedColumns: ["vendor_profile_id"]
          },
          {
            foreignKeyName: "vendor_categories_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_profiles: {
        Row: {
          auth_user_id: string | null
          business_name: string
          city: string | null
          contact_email: string | null
          contact_name: string | null
          created_at: string
          id: string
          instagram_handle: string | null
          logo_path: string | null
          standing: Database["public"]["Enums"]["vendor_standing"]
          updated_at: string
          verification: Database["public"]["Enums"]["vendor_verification"]
        }
        Insert: {
          auth_user_id?: string | null
          business_name: string
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          instagram_handle?: string | null
          logo_path?: string | null
          standing?: Database["public"]["Enums"]["vendor_standing"]
          updated_at?: string
          verification?: Database["public"]["Enums"]["vendor_verification"]
        }
        Update: {
          auth_user_id?: string | null
          business_name?: string
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          id?: string
          instagram_handle?: string | null
          logo_path?: string | null
          standing?: Database["public"]["Enums"]["vendor_standing"]
          updated_at?: string
          verification?: Database["public"]["Enums"]["vendor_verification"]
        }
        Relationships: []
      }
      vendor_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: number
          new_standing: Database["public"]["Enums"]["vendor_standing"]
          previous_standing:
            | Database["public"]["Enums"]["vendor_standing"]
            | null
          reason: string
          vendor_profile_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: never
          new_standing: Database["public"]["Enums"]["vendor_standing"]
          previous_standing?:
            | Database["public"]["Enums"]["vendor_standing"]
            | null
          reason: string
          vendor_profile_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: never
          new_standing?: Database["public"]["Enums"]["vendor_standing"]
          previous_standing?:
            | Database["public"]["Enums"]["vendor_standing"]
            | null
          reason?: string
          vendor_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_status_history_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_passport_summary"
            referencedColumns: ["vendor_profile_id"]
          },
          {
            foreignKeyName: "vendor_status_history_vendor_profile_id_fkey"
            columns: ["vendor_profile_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vendor_passport_summary: {
        Row: {
          business_name: string | null
          milestone_name: string | null
          milestone_threshold: number | null
          next_milestone_name: string | null
          next_milestone_threshold: number | null
          stamp_count: number | null
          stamps_to_next_milestone: number | null
          vendor_profile_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      vendor_active_stamp_count: {
        Args: { p_vendor_profile_id: string }
        Returns: number
      }
    }
    Enums: {
      challenge_status: "active" | "completed" | "voided"
      consent_action: "granted" | "withdrawn"
      event_status: "upcoming" | "completed" | "cancelled"
      opportunity_status: "draft" | "active" | "closed"
      stamp_type: "booking" | "bonus"
      submission_status:
        | "submitted"
        | "shortlisted"
        | "selected"
        | "not_selected"
        | "withdrawn"
      subscriber_status:
        | "subscribed"
        | "unsubscribed"
        | "bounced"
        | "complained"
      vendor_standing:
        | "good_standing"
        | "review_required"
        | "restricted"
        | "do_not_book"
      vendor_verification: "pending_verification" | "verified" | "rejected"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      challenge_status: ["active", "completed", "voided"],
      consent_action: ["granted", "withdrawn"],
      event_status: ["upcoming", "completed", "cancelled"],
      opportunity_status: ["draft", "active", "closed"],
      stamp_type: ["booking", "bonus"],
      submission_status: [
        "submitted",
        "shortlisted",
        "selected",
        "not_selected",
        "withdrawn",
      ],
      subscriber_status: [
        "subscribed",
        "unsubscribed",
        "bounced",
        "complained",
      ],
      vendor_standing: [
        "good_standing",
        "review_required",
        "restricted",
        "do_not_book",
      ],
      vendor_verification: ["pending_verification", "verified", "rejected"],
    },
  },
} as const
