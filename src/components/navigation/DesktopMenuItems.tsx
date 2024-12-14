import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

interface DesktopMenuItemsProps {
  onLoginClick: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  handleLogout: () => void;
}

const DesktopMenuItems: React.FC<DesktopMenuItemsProps> = ({
  onLoginClick,
  isAuthenticated,
  isAdmin,
  handleLogout
}) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link to="/about" className="text-gray-600 hover:text-linkedin-primary">About</Link>
      <Link to="/pricing" className="text-gray-600 hover:text-linkedin-primary">Pricing</Link>
      {isAuthenticated ? (
        <Link to="/dashboard" className="text-gray-600 hover:text-linkedin-primary">Dashboard</Link>
      ) : null}
      {isAdmin && (
        <Link to="/admin" className="text-gray-600 hover:text-linkedin-primary">Admin</Link>
      )}
      {!isAuthenticated && (
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
  );
};

export default DesktopMenuItems;