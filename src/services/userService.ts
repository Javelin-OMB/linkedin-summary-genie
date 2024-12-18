import { supabase } from "@/integrations/supabase/client";
import { NewUser, User } from "@/types/user";

export const fetchUsers = async (): Promise<User[]> => {
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('email', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  return users as User[];
};

export const addUserToDatabase = async (userData: NewUser): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserInDatabase = async (id: string, updates: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};