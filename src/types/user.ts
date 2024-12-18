export interface User {
  id: string;
  email: string;
  credits: number;
  is_admin: boolean;
  name: string | null;
  trial_start: string | null;
}

export type NewUser = {
  email: string;
  credits: number;
  is_admin?: boolean;
  name?: string | null;
  trial_start?: string | null;
};

// This type matches exactly what Supabase expects for the users table
export type SupabaseUser = {
  id?: string;
  email: string;
  credits?: number;
  is_admin?: boolean;
  name?: string | null;
  trial_start?: string | null;
};