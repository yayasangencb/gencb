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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          checked_by: string | null
          event_id: string
          id: string
          registration_id: string
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          checked_by?: string | null
          event_id: string
          id?: string
          registration_id: string
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          checked_by?: string | null
          event_id?: string
          id?: string
          registration_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      certificate_templates: {
        Row: {
          created_at: string
          design_config: Json
          event_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          design_config?: Json
          event_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          design_config?: Json
          event_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificate_templates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string | null
          event_id: string
          file_url: string | null
          id: string
          issued_at: string
          qr_verification_value: string | null
          registration_id: string
          template_id: string | null
        }
        Insert: {
          certificate_number?: string | null
          event_id: string
          file_url?: string | null
          id?: string
          issued_at?: string
          qr_verification_value?: string | null
          registration_id: string
          template_id?: string | null
        }
        Update: {
          certificate_number?: string | null
          event_id?: string
          file_url?: string | null
          id?: string
          issued_at?: string
          qr_verification_value?: string | null
          registration_id?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "certificate_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      donation_programs: {
        Row: {
          collected_amount: number
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          target_amount: number
          title: string
        }
        Insert: {
          collected_amount?: number
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          target_amount?: number
          title: string
        }
        Update: {
          collected_amount?: number
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          target_amount?: number
          title?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donation_program_id: string | null
          donor_name: string | null
          id: string
          is_anonymous: boolean
          is_verified: boolean
          method: Database["public"]["Enums"]["donation_method"]
          proof_url: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          donation_program_id?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean
          is_verified?: boolean
          method?: Database["public"]["Enums"]["donation_method"]
          proof_url?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          donation_program_id?: string | null
          donor_name?: string | null
          id?: string
          is_anonymous?: boolean
          is_verified?: boolean
          method?: Database["public"]["Enums"]["donation_method"]
          proof_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donation_program_id_fkey"
            columns: ["donation_program_id"]
            isOneToOne: false
            referencedRelation: "donation_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      event_categories_lomba: {
        Row: {
          event_id: string
          id: string
          name: string
          requirements_text: string | null
        }
        Insert: {
          event_id: string
          id?: string
          name: string
          requirements_text?: string | null
        }
        Update: {
          event_id?: string
          id?: string
          name?: string
          requirements_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_categories_lomba_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_committee: {
        Row: {
          event_id: string
          id: string
          role_in_event: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          role_in_event?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          role_in_event?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_committee_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          event_date_end: string | null
          event_date_start: string | null
          guidebook_url: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          location_text: string | null
          poster_url: string | null
          price: number | null
          proposal_doc_url: string | null
          quota: number
          registered_count: number
          registration_end: string | null
          registration_start: string | null
          rundown: Json
          slug: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date_end?: string | null
          event_date_start?: string | null
          guidebook_url?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          location_text?: string | null
          poster_url?: string | null
          price?: number | null
          proposal_doc_url?: string | null
          quota?: number
          registered_count?: number
          registration_end?: string | null
          registration_start?: string | null
          rundown?: Json
          slug: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date_end?: string | null
          event_date_start?: string | null
          guidebook_url?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          location_text?: string | null
          poster_url?: string | null
          price?: number | null
          proposal_doc_url?: string | null
          quota?: number
          registered_count?: number
          registration_end?: string | null
          registration_start?: string | null
          rundown?: Json
          slug?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          title: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          title: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_media: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string
          id: string
          media_type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          media_type?: Database["public"]["Enums"]["media_type"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_media_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string | null
          category: string
          content: string | null
          cover_image: string | null
          created_at: string
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["news_status"]
          tags: string[]
          title: string
          video_url: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string
          content?: string | null
          cover_image?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["news_status"]
          tags?: string[]
          title: string
          video_url?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string | null
          cover_image?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["news_status"]
          tags?: string[]
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      news_comments: {
        Row: {
          comment_text: string
          created_at: string
          id: string
          is_approved: boolean
          name: string | null
          news_id: string
          user_id: string | null
        }
        Insert: {
          comment_text: string
          created_at?: string
          id?: string
          is_approved?: boolean
          name?: string | null
          news_id: string
          user_id?: string | null
        }
        Update: {
          comment_text?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          name?: string | null
          news_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_comments_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications_log: {
        Row: {
          channel: Database["public"]["Enums"]["notif_channel"]
          id: string
          message: string | null
          sent_at: string | null
          status: string
          target_user_id: string | null
          title: string
        }
        Insert: {
          channel?: Database["public"]["Enums"]["notif_channel"]
          id?: string
          message?: string | null
          sent_at?: string | null
          status?: string
          target_user_id?: string | null
          title: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["notif_channel"]
          id?: string
          message?: string | null
          sent_at?: string | null
          status?: string
          target_user_id?: string | null
          title?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          category: string
          cover_image: string | null
          created_at: string
          description: string | null
          documents: Json
          id: string
          is_published: boolean
          target_text: string | null
          title: string
        }
        Insert: {
          category: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          documents?: Json
          id?: string
          is_published?: boolean
          target_text?: string | null
          title: string
        }
        Update: {
          category?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          documents?: Json
          id?: string
          is_published?: boolean
          target_text?: string | null
          title?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          address: string | null
          agreement_checked: boolean
          birth_date: string | null
          birth_place: string | null
          created_at: string
          email: string | null
          event_id: string
          full_name: string
          gender: string | null
          id: string
          kk_url: string | null
          ktp_url: string | null
          lomba_category_id: string | null
          nik: string | null
          participant_number: string | null
          payment_proof_url: string | null
          phone: string | null
          photo_url: string | null
          qr_code_value: string | null
          rw: string | null
          school: string | null
          user_id: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          address?: string | null
          agreement_checked?: boolean
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string
          email?: string | null
          event_id: string
          full_name: string
          gender?: string | null
          id?: string
          kk_url?: string | null
          ktp_url?: string | null
          lomba_category_id?: string | null
          nik?: string | null
          participant_number?: string | null
          payment_proof_url?: string | null
          phone?: string | null
          photo_url?: string | null
          qr_code_value?: string | null
          rw?: string | null
          school?: string | null
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          address?: string | null
          agreement_checked?: boolean
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string
          email?: string | null
          event_id?: string
          full_name?: string
          gender?: string | null
          id?: string
          kk_url?: string | null
          ktp_url?: string | null
          lomba_category_id?: string | null
          nik?: string | null
          participant_number?: string | null
          payment_proof_url?: string | null
          phone?: string | null
          photo_url?: string | null
          qr_code_value?: string | null
          rw?: string | null
          school?: string | null
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_lomba_category_id_fkey"
            columns: ["lomba_category_id"]
            isOneToOne: false
            referencedRelation: "event_categories_lomba"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          message: string
          name: string
          photo_url: string | null
          rating: number
          role_or_affiliation: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          message: string
          name: string
          photo_url?: string | null
          rating?: number
          role_or_affiliation?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          message?: string
          name?: string
          photo_url?: string | null
          rating?: number
          role_or_affiliation?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users_profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_committee: {
        Args: { _event_id: string; _user_id: string }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "editor" | "panitia" | "peserta"
      donation_method: "transfer" | "qris"
      event_status:
        | "open"
        | "soon"
        | "ongoing"
        | "closed"
        | "draft"
        | "finished"
        | "cancelled"
      media_type: "photo" | "video"
      news_status: "draft" | "published" | "archived"
      notif_channel: "email" | "whatsapp" | "push"
      verification_status:
        | "pending"
        | "verified"
        | "rejected"
        | "accepted"
        | "waiting"
        | "present"
        | "absent"
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
      app_role: ["super_admin", "admin", "editor", "panitia", "peserta"],
      donation_method: ["transfer", "qris"],
      event_status: [
        "open",
        "soon",
        "ongoing",
        "closed",
        "draft",
        "finished",
        "cancelled",
      ],
      media_type: ["photo", "video"],
      news_status: ["draft", "published", "archived"],
      notif_channel: ["email", "whatsapp", "push"],
      verification_status: [
        "pending",
        "verified",
        "rejected",
        "accepted",
        "waiting",
        "present",
        "absent",
      ],
    },
  },
} as const
