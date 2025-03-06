import { create } from 'zustand';
import { getSupabaseClient } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Event = Database['public']['Tables']['events']['Row'];
type Media = Database['public']['Tables']['media']['Row'];

interface EventStore {
  currentEvent: Event | null;
  mediaItems: Media[];
  loading: boolean;
  createEvent: (name: string, description?: string) => Promise<Event>;
  setCurrentEvent: (event: Event) => void;
  addMediaItem: (eventId: string, type: 'photo' | 'video', url: string) => Promise<void>;
  fetchMediaItems: (eventId: string) => Promise<void>;
}

export const useEventStore = create<EventStore>((set, get) => ({
  currentEvent: null,
  mediaItems: [],
  loading: false,

  createEvent: async (name, description) => {
    const supabase = getSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        name,
        description,
        user_id: user.user.id,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create event');
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from event creation');
    }

    set({ currentEvent: data });
    return data;
  },

  setCurrentEvent: (event) => set({ currentEvent: event }),

  addMediaItem: async (eventId, type, url) => {
    const supabase = getSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('media')
      .insert({
        event_id: eventId,
        type,
        url,
        user_id: user.user.id,
      });

    if (error) {
      toast.error('Failed to save media');
      throw error;
    }

    // Refresh media items
    get().fetchMediaItems(eventId);
  },

  fetchMediaItems: async (eventId) => {
    set({ loading: true });
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch media items');
      throw error;
    }

    set({ mediaItems: data || [], loading: false });
  },
}));