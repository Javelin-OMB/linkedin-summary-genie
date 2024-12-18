import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  credits: number;
  is_admin: boolean;
  name: string | null;
  trial_start: string | null;
}

export const useAdminUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('email', { ascending: true });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Could not load users. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }

      return users as User[];
    } catch (error) {
      console.error('Error loading users:', error);
      throw new Error('Failed to load users');
    }
  };

  const { data: users, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addUser = async (userData: { email: string; credits: number }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "User added successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: error.message || "Could not add user",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "Could not update user",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users: users || [],
    isLoading,
    error,
    refetch,
    addUser,
    updateUser,
  };
};