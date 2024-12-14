import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminUserTable from "@/components/AdminUserTable";

interface UserData {
  id: string;
  email: string;
  credits: number;
  is_admin: boolean;
}

const Admin = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAndLoadUsers = async () => {
      try {
        if (!session?.user?.id) {
          console.log('No session found, redirecting to login');
          navigate('/login');
          return;
        }

        // Check if current user is admin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          throw new Error('Failed to check admin status');
        }

        if (!userData?.is_admin) {
          console.log('User is not admin, redirecting to home');
          navigate('/');
          toast({
            title: "Toegang geweigerd",
            description: "Je hebt geen toegang tot deze pagina.",
            variant: "destructive",
          });
          return;
        }

        setIsCheckingAdmin(false);

        // Load all users
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
        console.error('Error in admin page:', error);
        toast({
          title: "Fout",
          description: error instanceof Error ? error.message : "Er is een fout opgetreden",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndLoadUsers();
  }, [session, navigate, toast]);

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
      const { data: newUsers, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('email');

      if (fetchError) throw fetchError;

      setUsers(newUsers);

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
      throw error; // Re-throw to handle in the component
    }
  };

  if (isCheckingAdmin) {
    return <LoadingSpinner message="Controleren van rechten..." />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Gebruikers laden..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-linkedin-primary" />
        <h1 className="text-2xl font-bold text-linkedin-primary">Gebruikers Beheer</h1>
      </div>

      <AdminUserTable 
        users={users}
        onUpdateCredits={handleUpdateCredits}
        onToggleAdmin={handleToggleAdmin}
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default Admin;