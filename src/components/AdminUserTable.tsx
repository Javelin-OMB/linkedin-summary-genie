import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AddUserDialog from "./admin/AddUserDialog";
import LoadingSpinner from "./LoadingSpinner";
import UserTableContent from "./admin/UserTableContent";

interface UserData {
  id: string;
  email: string;
  credits: number;
  is_admin: boolean;
}

interface AdminUserTableProps {
  users: UserData[];
  onUpdateCredits: (userId: string, change: number) => Promise<void>;
  onToggleAdmin: (userId: string) => Promise<void>;
  onAddUser: (email: string, initialCredits: number) => Promise<void>;
}

const AdminUserTable = ({ 
  users, 
  onUpdateCredits, 
  onToggleAdmin,
  onAddUser 
}: AdminUserTableProps) => {
  const [localUsers, setLocalUsers] = useState<UserData[]>(users);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const handleUpdateCredits = async (userId: string, change: number) => {
    try {
      setIsUpdating(true);
      await onUpdateCredits(userId, change);
      
      const { data: updatedUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setLocalUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, credits: updatedUser.credits } : user
        )
      );

      toast({
        title: "Credits bijgewerkt",
        description: `Credits zijn succesvol bijgewerkt voor ${updatedUser.email}`,
      });
    } catch (error) {
      console.error('Error updating credits:', error);
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het bijwerken van de credits",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!users || users.length === 0) {
    return <LoadingSpinner message="Gebruikers laden..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gebruikers Beheer</h2>
        <AddUserDialog onAddUser={onAddUser} />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <UserTableContent
          users={localUsers}
          isUpdating={isUpdating}
          onUpdateCredits={handleUpdateCredits}
          onToggleAdmin={onToggleAdmin}
        />
      </div>
    </div>
  );
};

export default AdminUserTable;