import { useEffect } from "react";
import { Users } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminUserTable from "@/components/AdminUserTable";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAdminUsers } from "@/hooks/useAdminUsers";

const Admin = () => {
  const { isCheckingAdmin } = useAdminCheck();
  const {
    users,
    isLoading,
    fetchUsers,
    handleUpdateCredits,
    handleToggleAdmin,
    handleAddUser
  } = useAdminUsers();

  useEffect(() => {
    if (!isCheckingAdmin) {
      fetchUsers();
    }
  }, [isCheckingAdmin, fetchUsers]);

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