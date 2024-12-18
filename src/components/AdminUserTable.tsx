import { User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserActions from "./admin/UserActions";
import UserRoleBadge from "./admin/UserRoleBadge";
import AddUserDialog from "./admin/AddUserDialog";
import LoadingSpinner from "./LoadingSpinner";

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
        {isUpdating ? (
          <div className="p-4">
            <LoadingSpinner message="Bezig met bijwerken..." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gebruiker</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <UserRoleBadge isAdmin={user.is_admin} />
                  </TableCell>
                  <TableCell>{user.credits}</TableCell>
                  <TableCell>
                    <UserActions
                      userId={user.id}
                      isAdmin={user.is_admin}
                      onUpdateCredits={handleUpdateCredits}
                      onToggleAdmin={onToggleAdmin}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminUserTable;