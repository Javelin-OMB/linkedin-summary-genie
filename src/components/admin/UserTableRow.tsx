import { User } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import UserActions from "./UserActions";
import UserRoleBadge from "./UserRoleBadge";

interface UserTableRowProps {
  user: {
    id: string;
    email: string;
    credits: number;
    is_admin: boolean;
  };
  onUpdateCredits: (userId: string, change: number) => Promise<void>;
  onToggleAdmin: (userId: string) => Promise<void>;
}

const UserTableRow = ({ user, onUpdateCredits, onToggleAdmin }: UserTableRowProps) => (
  <TableRow>
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
        onUpdateCredits={onUpdateCredits}
        onToggleAdmin={onToggleAdmin}
      />
    </TableCell>
  </TableRow>
);

export default UserTableRow;