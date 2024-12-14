import { LogIn, LogOut, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AuthButtonsProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

const AuthButtons = ({ isLoggedIn, onLoginClick, onLogout }: AuthButtonsProps) => {
  if (isLoggedIn) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onLogout}
        className="text-linkedin-primary"
      >
        <LogOut className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onLoginClick}
        className="text-linkedin-primary"
      >
        <LogIn className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLoginClick}
        className="text-linkedin-primary"
      >
        <UserPlus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default AuthButtons;