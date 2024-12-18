import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

interface MobileMenuLinksProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  credits: number | null;
  onLoginClick: () => void;
  handleLogout: () => void;
  onClose: () => void;
  navigate: (path: string) => void;
}

const MobileMenuLinks: React.FC<MobileMenuLinksProps> = ({
  isAuthenticated,
  isAdmin,
  credits,
  onLoginClick,
  handleLogout,
  onClose,
  navigate
}) => {
  return (
    <nav className="flex flex-col space-y-4 mt-8">
      <Link 
        to="/about" 
        className="text-lg hover:text-brand-primary"
        onClick={onClose}
      >
        About
      </Link>
      <Link 
        to="/how-it-works" 
        className="text-lg hover:text-brand-primary"
        onClick={onClose}
      >
        How it Works
      </Link>
      <Link 
        to="/pricing" 
        className="text-lg hover:text-brand-primary"
        onClick={onClose}
      >
        Pricing
      </Link>
      
      {isAuthenticated ? (
        <>
          <Link 
            to="/dashboard" 
            className="text-lg hover:text-brand-primary"
            onClick={onClose}
          >
            Dashboard {credits !== null && `(${credits} credits)`}
          </Link>
          <Link 
            to="/settings" 
            className="text-lg hover:text-brand-primary"
            onClick={onClose}
          >
            Settings
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              className="text-lg hover:text-brand-primary flex items-center"
              onClick={onClose}
            >
              Admin Panel
            </Link>
          )}
          <Button 
            variant="ghost" 
            onClick={() => {
              onClose();
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
              onClose();
              onLoginClick();
            }}
            className="w-full justify-center border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-black"
          >
            <User className="w-4 h-4 mr-2" />
            Login
          </Button>
          <Button 
            onClick={() => {
              onClose();
              navigate('/login?mode=signup');
            }}
            className="w-full justify-center bg-brand-primary hover:bg-brand-hover text-black"
          >
            Sign Up
          </Button>
        </div>
      )}
    </nav>
  );
};

export default MobileMenuLinks;