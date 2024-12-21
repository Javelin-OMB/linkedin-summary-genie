import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '../components/ui/use-toast';
import LoginDialog from "./LoginDialog";
import NavigationLinks from "./navigation/NavigationLinks";
import UserMenu from "./navigation/UserMenu";
import AuthButtons from "./navigation/AuthButtons";
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/authService';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const session = useSession();
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Uitgelogd",
        description: "Je bent succesvol uitgelogd.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Uitloggen mislukt",
        description: "Er is een fout opgetreden tijdens het uitloggen. Probeer het opnieuw.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Home className="h-6 w-6 text-linkedin-primary" />
              <span className="ml-2 text-xl font-semibold text-linkedin-primary">LeadSummary</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <NavigationLinks />
            {session ? (
              <UserMenu isAdmin={isAdmin} handleLogout={handleLogout} />
            ) : (
              <AuthButtons 
                onLoginClick={() => setIsLoginOpen(true)}
                onSignupClick={() => setIsSignupOpen(true)}
              />
            )}
          </div>
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
    </nav>
  );
};

export default Navbar;
