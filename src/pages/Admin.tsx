import { useEffect } from "react";
import { Users } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminUserTable from "@/components/AdminUserTable";
import { useAdminUsers } from "@/hooks/useAdminUsers";

const Admin = () => {
  const {
    users,
    isLoading,
    refetch,
    addUser,
    updateUser
  } = useAdminUsers();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleUpdateCredits = async (userId: string, change: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      await updateUser(userId, { credits: (user.credits || 0) + change });
      refetch();
    }
  };

  const handleToggleAdmin = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      await updateUser(userId, { is_admin: !user.is_admin });
      refetch();
    }
  };

  const handleAddUser = async (email: string, initialCredits: number) => {
    await addUser({ 
      email, 
      credits: initialCredits,
      is_admin: false 
    });
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner message="Gebruikers laden..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-[#0177B5]" />
        <h1 className="text-2xl font-bold text-[#0177B5]">Gebruikers Beheer</h1>
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