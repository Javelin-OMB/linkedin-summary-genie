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
            title: "Access Denied",
            description: "You don't have permission to access this page.",
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
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred",
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
        title: "Success",
        description: `Credits updated for ${userToUpdate.email}`,
      });
    } catch (error) {
      console.error('Error updating credits:', error);
      toast({
        title: "Error",
        description: "Failed to update credits",
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
        title: "Success",
        description: `Admin status updated for ${userToUpdate.email}`,
      });
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive",
      });
    }
  };

  if (isCheckingAdmin) {
    return <LoadingSpinner message="Checking permissions..." />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-linkedin-primary" />
        <h1 className="text-2xl font-bold text-linkedin-primary">User Management</h1>
      </div>

      <AdminUserTable 
        users={users}
        onUpdateCredits={handleUpdateCredits}
        onToggleAdmin={handleToggleAdmin}
      />
    </div>
  );
};

export default Admin;