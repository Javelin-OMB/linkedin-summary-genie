import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Home, LogIn, LogOut, UserPlus, Users, LayoutDashboard, Settings, CreditCard, History } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const dashboardSections = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      section: "overview"
    },
    {
      title: "Plan",
      icon: CreditCard,
      section: "plan"
    },
    {
      title: "Recent Leadsummaries",
      icon: History,
      section: "analyses"
    },
    {
      title: "Settings",
      icon: Settings,
      section: "settings"
    }
  ];

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

  const handleSectionClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
      setIsSheetOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 border-b bg-white z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-linkedin-primary" />
              <span className="text-xl font-semibold text-linkedin-primary">LeadSummary</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-600 hover:text-linkedin-primary">About</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-linkedin-primary">Pricing</Link>
            {session ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-linkedin-primary">Dashboard</Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="text-linkedin-primary border-linkedin-primary hover:bg-linkedin-primary hover:text-white">
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Users className="w-4 h-4 mr-2" />
                        Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={onLoginClick}
                  className="text-linkedin-primary border-linkedin-primary hover:bg-linkedin-primary hover:text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/login?mode=signup')}
                  className="bg-linkedin-primary hover:bg-linkedin-primary/90 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-linkedin-primary border-linkedin-primary hover:bg-linkedin-primary hover:text-white">
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Users className="w-4 h-4 mr-2" />
                      Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={onLoginClick}
                  className="text-linkedin-primary border-linkedin-primary hover:bg-linkedin-primary hover:text-white"
                >
                  <LogIn className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => navigate('/login?mode=signup')}
                  className="bg-linkedin-primary hover:bg-linkedin-primary/90 text-white"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            )}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-linkedin-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link to="/about" className="text-lg hover:text-linkedin-primary">About</Link>
                  <Link to="/pricing" className="text-lg hover:text-linkedin-primary">Pricing</Link>
                  {session && (
                    <>
                      <Link to="/dashboard" className="text-lg hover:text-linkedin-primary">Dashboard</Link>
                      {isAdmin && (
                        <Link to="/admin" className="text-lg hover:text-linkedin-primary">Admin</Link>
                      )}
                      {isDashboardRoute && (
                        <div className="pt-4 border-t">
                          <h3 className="text-sm font-semibold text-gray-500 mb-4">Dashboard Sections</h3>
                          {dashboardSections.map((item) => (
                            <button
                              key={item.section}
                              onClick={() => handleSectionClick(item.section)}
                              className="flex items-center space-x-2 w-full py-2 px-2 rounded-lg hover:bg-gray-100 text-gray-700"
                            >
                              <item.icon className="w-5 h-5" />
                              <span>{item.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;