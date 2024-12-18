import { supabase } from "@/integrations/supabase/client";
import type { NewUser, User } from '@/types/user';

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
  // Generate a UUID for the new user
  const newUserId = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: newUserId,
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

export const upsertUsers = async (users: User[]) => {
  const { data, error } = await supabase
    .from('users')
    .upsert(users)
    .select();

  if (error) {
    console.error('Error upserting users:', error);
    throw error;
  }

  return data;
};