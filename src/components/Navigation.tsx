import { useState } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import LoginDialog from "./LoginDialog";
import { useSession } from '@supabase/auth-helpers-react';
import { useAuth } from "../hooks/useAuth";
import { useLogoutHandler } from "./auth/LogoutHandler";
import DesktopMenu from './navigation/DesktopMenu';
import MobileMenu from './navigation/MobileMenu';

interface NavigationProps {
  onLoginClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const session = useSession();
  const { isAdmin, user } = useAuth();
  const handleLogout = useLogoutHandler();

  return (
    <header className="fixed top-0 left-0 right-0 border-b bg-white z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-brand-primary" />
              <span className="text-xl font-semibold text-brand-primary">LeadSummary</span>
            </Link>
          </div>

          <DesktopMenu 
            session={!!session}
            isAdmin={isAdmin}
            credits={user?.credits ?? null}
            onLoginClick={onLoginClick}
            handleLogout={handleLogout}
          />

          <MobileMenu 
            isAuthenticated={!!session}
            isAdmin={isAdmin}
            onLoginClick={onLoginClick}
            handleLogout={handleLogout}
            credits={user?.credits ?? null}
          />
        </div>
      </div>

      <LoginDialog 
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        mode="login"
      />

      <LoginDialog 
        isOpen={isSignupOpen}
        onOpenChange={setIsSignupOpen}
        mode="signup"
      />
    </header>
  );
};

export default Navigation;
