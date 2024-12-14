import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
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
  
  const isDashboardRoute = location.pathname === '/dashboard';

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error checking admin status:', error);
            return;
          }
          
          setIsAdmin(!!data?.is_admin);
        } catch (error) {
          console.error('Error in checkAdminStatus:', error);
        }
      }
    };

    checkAdminStatus();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
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
                      Admin
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