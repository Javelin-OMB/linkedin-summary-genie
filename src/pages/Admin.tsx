import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { User, Users, Plus, Minus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface UserData {
  id: string;
  email: string;
  credits: number;
  is_admin: boolean;
}

const Admin = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAndLoadUsers = async () => {
      if (!session?.user?.id) {
        navigate('/login');
        return;
      }

      // Check if current user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (!userData?.is_admin) {
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        return;
      }

      // Load all users
      const { data: allUsers, error } = await supabase
        .from('users')
        .select('*')
        .order('email');

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
        return;
      }

      setUsers(allUsers);
      setLoading(false);
    };

    checkAdminAndLoadUsers();
  }, [session, navigate, toast]);

  const updateCredits = async (userId: string, change: number) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    const newCredits = Math.max(0, userToUpdate.credits + change);
    
    const { error } = await supabase
      .from('users')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update credits",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(user => 
      user.id === userId ? { ...user, credits: newCredits } : user
    ));

    toast({
      title: "Success",
      description: `Credits updated for ${userToUpdate.email}`,
    });
  };

  const toggleAdmin = async (userId: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    const { error } = await supabase
      .from('users')
      .update({ is_admin: !userToUpdate.is_admin })
      .eq('id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(user => 
      user.id === userId ? { ...user, is_admin: !user.is_admin } : user
    ));

    toast({
      title: "Success",
      description: `Admin status updated for ${userToUpdate.email}`,
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-linkedin-primary" />
        <h1 className="text-2xl font-bold text-linkedin-primary">User Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.email}
                </TableCell>
                <TableCell>{user.credits}</TableCell>
                <TableCell>
                  {user.is_admin ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCredits(user.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCredits(user.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdmin(user.id)}
                    >
                      {user.is_admin ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Admin;