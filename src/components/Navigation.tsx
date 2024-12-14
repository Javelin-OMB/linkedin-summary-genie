import React, { useEffect, useState } from 'react';
import { Home, Users } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthButtons from './navigation/AuthButtons';
import MobileMenu from './navigation/MobileMenu';

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

          if (error) throw error;
          setIsAdmin(data?.is_admin || false);
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };

    checkAdminStatus();
  }, [session]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    toast({
      title: "Logged out",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-linkedin-primary">
              <Home className="h-6 w-6" />
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-linkedin-primary">
                <Users className="h-6 w-6" />
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  className="hidden md:inline-flex"
                >
                  Dashboard
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/admin')}
                    className="hidden md:inline-flex"
                  >
                    Admin
                  </Button>
                )}
              </div>
            ) : null}

            <div className="hidden md:flex">
              <AuthButtons
                isLoggedIn={!!session}
                onLoginClick={onLoginClick}
                onLogout={handleLogout}
              />
            </div>

            <div className="md:hidden">
              <MobileMenu
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                isLoggedIn={!!session}
                isAdmin={isAdmin}
                isDashboardRoute={isDashboardRoute}
                onSectionChange={onSectionChange}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;