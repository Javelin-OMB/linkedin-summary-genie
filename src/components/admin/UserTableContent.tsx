import { Table, TableBody } from "@/components/ui/table";
import UserTableHeader from "./UserTableHeader";
import UserTableRow from "./UserTableRow";
import LoadingSpinner from "../LoadingSpinner";

interface UserData {
  id: string;
  email: string;
  credits: number;
  is_admin: boolean;
}

interface UserTableContentProps {
  users: UserData[];
  isUpdating: boolean;
  onUpdateCredits: (userId: string, change: number) => Promise<void>;
  onToggleAdmin: (userId: string) => Promise<void>;
}

const UserTableContent = ({ 
  users, 
  isUpdating, 
  onUpdateCredits, 
  onToggleAdmin 
}: UserTableContentProps) => {
  if (isUpdating) {
    return (
      <div className="p-4">
        <LoadingSpinner message="Bezig met bijwerken..." />
      </div>
    );
  }

  return (
    <Table>
      <UserTableHeader />
      <TableBody>
        {users.map((user) => (
          <UserTableRow
            key={user.id}
            user={user}
            onUpdateCredits={onUpdateCredits}
            onToggleAdmin={onToggleAdmin}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTableContent;