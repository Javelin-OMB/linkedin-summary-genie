import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavigationLinks from "./NavigationLinks";
import UserMenu from "./UserMenu";

interface DesktopMenuProps {
  session: boolean;
  isAdmin: boolean;
  credits: number | null;
  onLoginClick: () => void;
  handleLogout: () => void;
}

const DesktopMenu = ({ 
  session, 
  isAdmin, 
  credits, 
  onLoginClick, 
  handleLogout 
}: DesktopMenuProps) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center space-x-8">
      <NavigationLinks />
      
      {session ? (
        <UserMenu 
          credits={credits} 
          isAdmin={isAdmin} 
          handleLogout={handleLogout} 
        />
      ) : (
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onLoginClick}
            className="flex items-center border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            <User className="h-5 w-5 mr-1" />
            Login
          </Button>
          <Button 
            onClick={() => navigate('/login?mode=signup')}
            className="bg-brand-primary hover:bg-brand-hover text-black"
          >
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
};

export default DesktopMenu;