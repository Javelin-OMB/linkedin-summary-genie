import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Home, LogIn, LogOut, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
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

interface NavigationProps {
  onLoginClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick }) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

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
                  onClick={() => navigate('/login')}
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
                  onClick={() => navigate('/login')}
                  className="bg-linkedin-primary hover:bg-linkedin-primary/90 text-white"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            )}
            <Sheet>
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
                    <Link to="/dashboard" className="text-lg hover:text-linkedin-primary">Dashboard</Link>
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