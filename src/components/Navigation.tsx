import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Home, LayoutDashboard, Settings, CreditCard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";

interface NavigationProps {
  onLoginClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick }) => {
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
            <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-linkedin-primary">
              <LayoutDashboard className="w-4 h-4 mr-1" />
              Dashboard
            </Link>
            <Link to="/settings" className="flex items-center text-gray-600 hover:text-linkedin-primary">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Link>
            <Link to="/plan" className="flex items-center text-gray-600 hover:text-linkedin-primary">
              <CreditCard className="w-4 h-4 mr-1" />
              Plan
            </Link>
            <Button 
              variant="outline" 
              onClick={onLoginClick}
              className="text-linkedin-primary border-linkedin-primary hover:bg-linkedin-primary hover:text-white"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={onLoginClick}
              className="text-linkedin-primary border-linkedin-primary hover:bg-linkedin-primary hover:text-white"
            >
              Login
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-linkedin-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link to="/dashboard" className="flex items-center text-lg hover:text-linkedin-primary">
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Dashboard
                  </Link>
                  <Link to="/settings" className="flex items-center text-lg hover:text-linkedin-primary">
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                  </Link>
                  <Link to="/plan" className="flex items-center text-lg hover:text-linkedin-primary">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Plan
                  </Link>
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