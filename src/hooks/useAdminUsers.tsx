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

  const handleUpdateCredits = async (userId: string, change: number) => {
    try {
      await checkAdminStatus();
      
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const newCredits = (user.credits || 0) + change;
      if (newCredits < 0) {
        throw new Error('Credits cannot be negative');
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', userId);

      if (updateError) throw updateError;

      await fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error updating credits:', error);
      toast({
        title: "Fout",
        description: "Kon credits niet bijwerken",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleToggleAdmin = async (userId: string) => {
    try {
      await checkAdminStatus();
      
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('users')
        .update({ is_admin: !user.is_admin })
        .eq('id', userId);

      if (updateError) throw updateError;

      await fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        title: "Fout",
        description: "Kon admin status niet wijzigen",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleAddUser = async (email: string, initialCredits: number) => {
    try {
      await checkAdminStatus();

      const { error } = await supabase
        .from('users')
        .insert([
          { 
            email,
            credits: initialCredits,
            is_admin: false
          }
        ]);

      if (error) throw error;

      await fetchUsers(); // Refresh the users list
      toast({
        title: "Succes",
        description: "Nieuwe gebruiker toegevoegd",
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Fout",
        description: "Kon gebruiker niet toevoegen",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    users,
    isLoading,
    fetchUsers,
    handleUpdateCredits,
    handleToggleAdmin,
    handleAddUser
  };
};