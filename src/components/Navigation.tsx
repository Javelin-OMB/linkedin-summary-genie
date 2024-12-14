import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, LogOut, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
import DesktopMenuItems from './navigation/DesktopMenuItems';
import MobileMenu from './navigation/MobileMenu';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  onLoginClick: () => void;
  onSectionChange?: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onSectionChange }) => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const supabase = useSupabaseClient();
  
  const isDashboardRoute = location.pathname === '/dashboard';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        console.log('Checking admin status for user:', session.user.email);
        const { data, error } = await supabase
          .from('users')
          .select('credits, is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin status:', error);
          return;
        }
        
        setIsAdmin(!!data?.is_admin);
        setCredits(data?.credits ?? 0);
        
        if (data?.is_admin) {
          console.log('Admin status confirmed for user:', session.user.email);
          toast({
            title: "Admin Access",
            description: "Je bent ingelogd als administrator",
          });
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    fetchUserData();
  }, [session, toast, supabase]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      toast({
        title: "Uitgelogd",
        description: "Je bent succesvol uitgelogd.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Uitloggen mislukt",
        description: "Er is een fout opgetreden tijdens het uitloggen.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 border-b bg-white z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-linkedin-primary" />
              <span className="text-xl font-semibold text-linkedin-primary">LeadSummary</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-600 hover:text-linkedin-primary">About</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-linkedin-primary">Pricing</Link>
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white"
                  >
                    <User className="h-5 w-5 mr-1" />
                    Account {credits !== null && `(${credits} credits)`}
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
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Uitloggen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={onLoginClick}
                  className="flex items-center border-linkedin-primary text-linkedin-primary hover:bg-linkedin-primary hover:text-white"
                >
                  <User className="h-5 w-5 mr-1" />
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/login?mode=signup')}
                  className="bg-linkedin-primary hover:bg-linkedin-primary/90 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          <MobileMenu 
            isAuthenticated={!!session}
            isAdmin={isAdmin}
            onLoginClick={onLoginClick}
            onSectionChange={onSectionChange}
            isDashboardRoute={isDashboardRoute}
          />
        </div>
      </div>
    </header>
  );
};

export default Navigation;