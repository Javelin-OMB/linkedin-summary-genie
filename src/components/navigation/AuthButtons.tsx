import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthButtonsProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const AuthButtons = ({ onLoginClick, onSignupClick }: AuthButtonsProps) => {
  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white"
        onClick={onLoginClick}
      >
        <User className="h-5 w-5 mr-1" />
        Login
      </Button>
      <Button 
        className="flex items-center bg-linkedin-primary text-white hover:bg-linkedin-hover"
        onClick={onSignupClick}
      >
        Sign Up
      </Button>
    </>
  );
};

export default AuthButtons;