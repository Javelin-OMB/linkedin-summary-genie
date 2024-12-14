import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import DesktopMenuItems from './navigation/DesktopMenuItems';
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

          <DesktopMenuItems 
            onLoginClick={onLoginClick}
            isAuthenticated={!!session}
            isAdmin={isAdmin}
            handleLogout={handleLogout}
          />

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