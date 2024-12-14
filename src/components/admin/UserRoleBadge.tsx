import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserRoleBadgeProps {
  isAdmin: boolean;
}

const UserRoleBadge = ({ isAdmin }: UserRoleBadgeProps) => {
  if (isAdmin) {
    return (
      <Badge variant="default" className="bg-linkedin-primary hover:bg-linkedin-primary">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    );
  }
  return <Badge variant="secondary">Gebruiker</Badge>;
};

export default UserRoleBadge;