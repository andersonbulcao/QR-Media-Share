export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          name: string
          description: string | null
          qr_code: string | null
          expires_at: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          qr_code?: string | null
          expires_at?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          qr_code?: string | null
          expires_at?: string | null
          created_at?: string
          user_id?: string
        }
      }
      media: {
        Row: {
          id: string
          event_id: string
          type: 'photo' | 'video'
          url: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          event_id: string
          type: 'photo' | 'video'
          url: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          event_id?: string
          type?: 'photo' | 'video'
          url?: string
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}