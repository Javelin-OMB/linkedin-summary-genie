import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UserData {
  id: string;
  email: string;
  credits: number;
  is_admin: boolean;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data: allUsers, error } = await supabase
        .from('users')
        .select('*')
        .order('email');

      if (error) {
        throw new Error('Failed to load users');
      }

      console.log('Successfully loaded users:', allUsers.length);
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Fout",
        description: "Kon gebruikers niet laden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCredits = async (userId: string, change: number) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;

      const newCredits = Math.max(0, userToUpdate.credits + change);
      
      const { error } = await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, credits: newCredits } : user
      ));

      toast({
        title: "Succes",
        description: `Credits bijgewerkt voor ${userToUpdate.email}`,
      });
    } catch (error) {
      console.error('Error updating credits:', error);
      toast({
        title: "Fout",
        description: "Kon credits niet bijwerken",
        variant: "destructive",
      });
    }
  };

  const handleToggleAdmin = async (userId: string) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;

      const { error } = await supabase
        .from('users')
        .update({ is_admin: !userToUpdate.is_admin })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !user.is_admin } : user
      ));

      toast({
        title: "Succes",
        description: `Admin status bijgewerkt voor ${userToUpdate.email}`,
      });
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        title: "Fout",
        description: "Kon admin status niet bijwerken",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async (email: string, initialCredits: number) => {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true,
        password: Math.random().toString(36).slice(-8), // Generate a random password
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error("No user created");

      // Then create the user record
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: email,
            credits: initialCredits,
            is_admin: false
          }
        ]);

      if (userError) throw userError;

      // Refresh the users list
      await fetchUsers();

      toast({
        title: "Succes",
        description: `Nieuwe gebruiker ${email} toegevoegd`,
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