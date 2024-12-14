import { Home, User, Info, DollarSign, LogOut, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import LoginDialog from "./LoginDialog";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        console.log('Checking admin status for user:', session.user.email);
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin status:', error);
          return;
        }
        
        console.log('Admin status data:', data);
        console.log('Is admin value:', data?.is_admin);
        setIsAdmin(!!data?.is_admin);
      }
    };

    checkAdminStatus();
  }, [session, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
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
            <Link to="/about">
              <Button variant="ghost" className="flex items-center">
                <Info className="h-5 w-5 mr-1" />
                About
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="ghost" className="flex items-center">
                <DollarSign className="h-5 w-5 mr-1" />
                Pricing
              </Button>
            </Link>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white"
                  >
                    <User className="h-5 w-5 mr-1" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Users className="h-4 w-4 mr-2" />
                      Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white"
                  onClick={() => setIsLoginOpen(true)}
                >
                  <User className="h-5 w-5 mr-1" />
                  Login
                </Button>
                <Button 
                  className="flex items-center bg-linkedin-primary text-white hover:bg-linkedin-hover"
                  onClick={() => setIsSignupOpen(true)}
                >
                  Sign Up
                </Button>
              </>
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