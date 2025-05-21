export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          user_role: string
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          user_role: string
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          user_role?: string
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      artist_profiles: {
        Row: {
          id: string
          bio: string | null
          years_experience: number
          specialties: string[]
          personal_brand_statement: string | null
          studio_name: string | null
          location: string | null
          is_mobile_artist: boolean
          location_preferences: string | null
          certifications: string | null
          style_tags: string[]
          hourly_rate: number | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          bio?: string | null
          years_experience: number
          specialties: string[]
          personal_brand_statement?: string | null
          studio_name?: string | null
          location?: string | null
          is_mobile_artist: boolean
          location_preferences?: string | null
          certifications?: string | null
          style_tags: string[]
          hourly_rate?: number | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bio?: string | null
          years_experience?: number
          specialties?: string[]
          personal_brand_statement?: string | null
          studio_name?: string | null
          location?: string | null
          is_mobile_artist?: boolean
          location_preferences?: string | null
          certifications?: string | null
          style_tags?: string[]
          hourly_rate?: number | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_images: {
        Row: {
          id: string
          artist_id: string
          image_url: string
          is_primary: boolean
          style_tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          image_url: string
          is_primary?: boolean
          style_tags: string[]
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          image_url?: string
          is_primary?: boolean
          style_tags?: string[]
          created_at?: string
        }
      }
      style_analysis: {
        Row: {
          id: string
          artist_id: string
          primary_style: string
          style_tags: string[]
          color_palette: string[]
          technique_strengths: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          primary_style: string
          style_tags: string[]
          color_palette: string[]
          technique_strengths: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          primary_style?: string
          style_tags?: string[]
          color_palette?: string[]
          technique_strengths?: Json
          created_at?: string
          updated_at?: string
        }
      }
      client_preferences: {
        Row: {
          id: string
          preferred_styles: string[]
          budget_min: number | null
          budget_max: number | null
          location: string | null
          search_radius: number
          preferred_experience: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          preferred_styles: string[]
          budget_min?: number | null
          budget_max?: number | null
          location?: string | null
          search_radius: number
          preferred_experience: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          preferred_styles?: string[]
          budget_min?: number | null
          budget_max?: number | null
          location?: string | null
          search_radius?: number
          preferred_experience?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          client_id: string
          artist_id: string
          booking_date: string
          start_time: string
          end_time: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          artist_id: string
          booking_date: string
          start_time: string
          end_time: string
          status: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          artist_id?: string
          booking_date?: string
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}
