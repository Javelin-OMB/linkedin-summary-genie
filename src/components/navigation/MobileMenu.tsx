import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLoginClick: () => void;
  handleLogout: () => void;
  credits?: number | null;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isAuthenticated,
  isAdmin,
  onLoginClick,
  handleLogout,
  credits
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-linkedin-primary">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <nav className="flex flex-col space-y-4 mt-8">
            <Link 
              to="/about" 
              className="text-lg hover:text-linkedin-primary"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-lg hover:text-linkedin-primary"
              onClick={() => setIsOpen(false)}
            >
              How it Works
            </Link>
            <Link 
              to="/pricing" 
              className="text-lg hover:text-linkedin-primary"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-lg hover:text-linkedin-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard {credits !== null && `(${credits} credits)`}
                </Link>
                <Link 
                  to="/settings" 
                  className="text-lg hover:text-linkedin-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-lg hover:text-linkedin-primary flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Uitloggen
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsOpen(false);
                    onLoginClick();
                  }}
                  className="w-full justify-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/login?mode=signup');
                  }}
                  className="w-full justify-center bg-linkedin-primary hover:bg-linkedin-hover text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;