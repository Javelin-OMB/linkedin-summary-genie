import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAdminCheck } from './useAdminCheck';

interface UserData {
  id: string;
  email: string;
  credits: number;
  is_admin: boolean;
  trial_start: string;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { checkAdminStatus } = useAdminCheck();

  const fetchUsers = async () => {
    try {
      await checkAdminStatus();

      const { data: allUsers, error } = await supabase
        .from('users')
        .select('*')
        .order('email');

      if (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to load users');
      }

      setUsers(allUsers || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Fout",
        description: error instanceof Error ? error.message : "Kon gebruikers niet laden",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    fetchUsers,
  };
};