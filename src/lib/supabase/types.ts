/**
 * Database types for the NF platform schema.
 *
 * HAND-WRITTEN, and deliberately shaped like Supabase's own generated output
 * so it can be replaced wholesale once a real project exists:
 *
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 *
 * Until then these are derived by hand from supabase/migrations/*.sql. They are
 * accurate as written, but they are a copy, and a copy can drift. Treat the SQL
 * as the source of truth and regenerate at the first opportunity.
 *
 * Nothing on the public marketing site imports this file.
 */

export type VendorStanding =
  | "good_standing"
  | "review_required"
  | "restricted"
  | "do_not_book";

export type VendorVerification =
  | "pending_verification"
  | "verified"
  | "rejected";

export type EventStatus = "upcoming" | "completed" | "cancelled";

export type StampType = "booking" | "bonus";

export type ChallengeStatus = "active" | "completed" | "voided";

export type OpportunityStatus = "draft" | "active" | "closed";

export type SubmissionStatus =
  | "submitted"
  | "shortlisted"
  | "selected"
  | "not_selected"
  | "withdrawn";

export type SubscriberStatus =
  | "subscribed"
  | "unsubscribed"
  | "bounced"
  | "complained";

export type ConsentAction = "granted" | "withdrawn";

/** Convenience: a table's Row shape, e.g. `Row<"vendor_profiles">`. */
export type Row<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { auth_user_id: string; role: string; created_at: string };
        Insert: { auth_user_id: string; role?: string; created_at?: string };
        Update: { role?: string };
      };

      audit_log: {
        Row: {
          id: number;
          actor_auth_user_id: string | null;
          action: string;
          target_table: string | null;
          target_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          actor_auth_user_id?: string | null;
          action: string;
          target_table?: string | null;
          target_id?: string | null;
          metadata?: Record<string, unknown>;
        };
        // Append only: an update trigger rejects every UPDATE.
        Update: never;
      };

      interests: {
        Row: {
          id: string;
          slug: string;
          label: string;
          display_order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          slug: string;
          label: string;
          display_order?: number;
          active?: boolean;
        };
        Update: {
          label?: string;
          display_order?: number;
          active?: boolean;
        };
      };

      vendor_profiles: {
        Row: {
          id: string;
          auth_user_id: string | null;
          business_name: string;
          contact_name: string | null;
          contact_email: string | null;
          instagram_handle: string | null;
          city: string | null;
          logo_path: string | null;
          /** INTERNAL ONLY. Never render this to a vendor or the public. */
          standing: VendorStanding;
          /** INTERNAL ONLY. */
          verification: VendorVerification;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          auth_user_id?: string | null;
          business_name: string;
          contact_name?: string | null;
          contact_email?: string | null;
          instagram_handle?: string | null;
          city?: string | null;
          logo_path?: string | null;
          standing?: VendorStanding;
          verification?: VendorVerification;
        };
        Update: {
          business_name?: string;
          contact_name?: string | null;
          contact_email?: string | null;
          instagram_handle?: string | null;
          city?: string | null;
          logo_path?: string | null;
          standing?: VendorStanding;
          verification?: VendorVerification;
        };
      };

      vendor_categories: {
        Row: { vendor_profile_id: string; interest_id: string };
        Insert: { vendor_profile_id: string; interest_id: string };
        Update: never;
      };

      vendor_status_history: {
        Row: {
          id: number;
          vendor_profile_id: string;
          previous_standing: VendorStanding | null;
          new_standing: VendorStanding;
          reason: string;
          changed_by: string | null;
          created_at: string;
        };
        Insert: {
          vendor_profile_id: string;
          previous_standing?: VendorStanding | null;
          new_standing: VendorStanding;
          reason: string;
          changed_by?: string | null;
        };
        Update: never;
      };

      events: {
        Row: {
          id: string;
          slug: string;
          name: string;
          starts_on: string;
          ends_on: string;
          status: EventStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          name: string;
          starts_on: string;
          ends_on: string;
          status?: EventStatus;
        };
        Update: {
          name?: string;
          starts_on?: string;
          ends_on?: string;
          status?: EventStatus;
        };
      };

      milestones: {
        Row: {
          id: string;
          threshold: number;
          name: string;
          benefits: string[];
          display_order: number;
          created_at: string;
        };
        Insert: {
          threshold: number;
          name: string;
          benefits?: string[];
          display_order?: number;
        };
        Update: {
          threshold?: number;
          name?: string;
          benefits?: string[];
          display_order?: number;
        };
      };

      passport_stamps: {
        Row: {
          id: string;
          vendor_profile_id: string;
          event_id: string;
          stamp_type: StampType;
          awarded_at: string;
          awarded_by: string | null;
          note: string | null;
          voided_at: string | null;
          voided_by: string | null;
          void_reason: string | null;
          created_at: string;
        };
        Insert: {
          vendor_profile_id: string;
          event_id: string;
          stamp_type?: StampType;
          awarded_by?: string | null;
          note?: string | null;
        };
        /**
         * Corrections void, never delete. An Update should only ever set the
         * void fields; there is no path that rewrites an award.
         */
        Update: {
          voided_at?: string;
          voided_by?: string | null;
          void_reason?: string;
        };
      };

      passport_challenges: {
        Row: {
          id: string;
          vendor_profile_id: string;
          status: ChallengeStatus;
          created_by: string | null;
          completed_at: string | null;
          voided_reason: string | null;
          reward_stamp_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          vendor_profile_id: string;
          status?: ChallengeStatus;
          created_by?: string | null;
        };
        Update: {
          status?: ChallengeStatus;
          completed_at?: string | null;
          voided_reason?: string | null;
          reward_stamp_id?: string | null;
        };
      };

      passport_challenge_events: {
        Row: { challenge_id: string; event_id: string };
        Insert: { challenge_id: string; event_id: string };
        Update: never;
      };

      opportunities: {
        Row: {
          id: string;
          title: string;
          description: string;
          event_id: string | null;
          opens_at: string | null;
          closes_at: string | null;
          min_stamp_threshold: number;
          requires_good_standing: boolean;
          status: OpportunityStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          event_id?: string | null;
          opens_at?: string | null;
          closes_at?: string | null;
          min_stamp_threshold?: number;
          requires_good_standing?: boolean;
          status?: OpportunityStatus;
          created_by?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          opens_at?: string | null;
          closes_at?: string | null;
          min_stamp_threshold?: number;
          requires_good_standing?: boolean;
          status?: OpportunityStatus;
        };
      };

      opportunity_submissions: {
        Row: {
          id: string;
          opportunity_id: string;
          vendor_profile_id: string;
          note: string | null;
          status: SubmissionStatus;
          submitted_at: string;
          updated_at: string;
        };
        Insert: {
          opportunity_id: string;
          vendor_profile_id: string;
          note?: string | null;
          status?: SubmissionStatus;
        };
        Update: { status?: SubmissionStatus; note?: string | null };
      };

      signup_sources: {
        Row: {
          id: string;
          slug: string;
          label: string;
          active: boolean;
          created_at: string;
        };
        Insert: { slug: string; label: string; active?: boolean };
        Update: { label?: string; active?: boolean };
      };

      club_subscribers: {
        Row: {
          id: string;
          first_name: string;
          email: string;
          status: SubscriberStatus;
          created_at: string;
          updated_at: string;
          provider_synced_at: string | null;
        };
        Insert: {
          first_name: string;
          email: string;
          status?: SubscriberStatus;
        };
        /** created_at is never updated, even on a repeat signup. */
        Update: {
          first_name?: string;
          status?: SubscriberStatus;
          provider_synced_at?: string | null;
        };
      };

      subscriber_interests: {
        Row: {
          subscriber_id: string;
          interest_id: string;
          created_at: string;
        };
        /** Repeat signups MERGE: upsert and ignore conflicts, never replace. */
        Insert: { subscriber_id: string; interest_id: string };
        Update: never;
      };

      consent_events: {
        Row: {
          id: number;
          subscriber_id: string;
          action: ConsentAction;
          consent_type: string;
          consent_text: string;
          consent_version: string;
          source_slug: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          subscriber_id: string;
          action: ConsentAction;
          consent_type?: string;
          consent_text: string;
          consent_version: string;
          source_slug?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        /** Append only: update and delete triggers reject every attempt. */
        Update: never;
      };

      subscriber_source_touches: {
        Row: {
          id: number;
          subscriber_id: string;
          source_slug: string;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_term: string | null;
          created_at: string;
        };
        Insert: {
          subscriber_id: string;
          source_slug: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_term?: string | null;
        };
        Update: never;
      };
    };

    Views: {
      /** Derived Passport state. Tier is computed, never stored. */
      vendor_passport_summary: {
        Row: {
          vendor_profile_id: string;
          business_name: string;
          stamp_count: number;
          milestone_name: string | null;
          milestone_threshold: number | null;
          next_milestone_name: string | null;
          next_milestone_threshold: number | null;
          stamps_to_next_milestone: number | null;
        };
      };
    };

    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      vendor_active_stamp_count: {
        Args: { p_vendor_profile_id: string };
        Returns: number;
      };
    };

    Enums: {
      vendor_standing: VendorStanding;
      vendor_verification: VendorVerification;
      event_status: EventStatus;
      stamp_type: StampType;
      challenge_status: ChallengeStatus;
      opportunity_status: OpportunityStatus;
      submission_status: SubmissionStatus;
      subscriber_status: SubscriberStatus;
      consent_action: ConsentAction;
    };
  };
}
