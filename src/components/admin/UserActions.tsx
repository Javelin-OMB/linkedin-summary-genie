import { Plus, Minus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserActionsProps {
  userId: string;
  isAdmin: boolean;
  onUpdateCredits: (userId: string, change: number) => Promise<void>;
  onToggleAdmin: (userId: string) => Promise<void>;
}

const UserActions = ({ userId, isAdmin, onUpdateCredits, onToggleAdmin }: UserActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onUpdateCredits(userId, 1)}
        title="Credit toevoegen"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onUpdateCredits(userId, -1)}
        title="Credit verwijderen"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onToggleAdmin(userId)}
        className={isAdmin ? "border-red-500 hover:border-red-600" : "border-green-500 hover:border-green-600"}
        title={isAdmin ? "Admin rechten verwijderen" : "Admin rechten toekennen"}
      >
        {isAdmin ? (
          <X className="h-4 w-4 text-red-500" />
        ) : (
          <Check className="h-4 w-4 text-green-500" />
        )}
      </Button>
    </div>
  );
};

export default UserActions;