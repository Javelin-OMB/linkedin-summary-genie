import { supabase } from "@/integrations/supabase/client";
import type { NewUser, User, SupabaseUser } from '@/types/user';

export const fetchUsers = async (): Promise<User[]> => {
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('email', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  return users;
};

export const addUserToDatabase = async (userData: NewUser): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: userData.email,
      credits: userData.credits,
      is_admin: userData.is_admin,
      name: userData.name,
      trial_start: userData.trial_start
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding user:', error);
    throw error;
  }

  return data;
};

export const updateUserInDatabase = async (id: string, updates: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }

  return data;
};

export const upsertUsers = async (users: SupabaseUser[]) => {
  const mappedUsers = users
    .filter(user => user.id && user.email)
    .map(user => ({
      id: user.id!,
      email: user.email!,
      name: user.name || null,
      credits: user.credits,
      is_admin: user.is_admin,
      trial_start: user.trial_start
    }));

  const { data, error } = await supabase
    .from('users')
    .upsert(mappedUsers)
    .select();

  if (error) {
    console.error('Error upserting users:', error);
    throw error;
  }

  return data;
};