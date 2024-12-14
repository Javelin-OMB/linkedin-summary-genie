import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, Home } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavigationProps {
  onLoginClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 border-b bg-white z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-linkedin-primary" />
            <span className="text-xl font-semibold text-linkedin-primary">LeadSummary</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-600 hover:text-linkedin-primary">About</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-linkedin-primary">Pricing</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-linkedin-primary">Dashboard</Link>
            <Button 
              variant="outline" 
              onClick={onLoginClick}
              className="text-linkedin-primary border-linkedin-primary hover:bg-linkedin-primary hover:text-white"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-linkedin-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link to="/" className="text-lg hover:text-linkedin-primary">Home</Link>
                  <Link to="/about" className="text-lg hover:text-linkedin-primary">About</Link>
                  <Link to="/pricing" className="text-lg hover:text-linkedin-primary">Pricing</Link>
                  <Link to="/dashboard" className="text-lg hover:text-linkedin-primary">Dashboard</Link>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <Button 
                    variant="outline" 
                    onClick={onLoginClick}
                    className="text-linkedin-primary border-linkedin-primary hover:bg-linkedin-primary hover:text-white w-full"
                  >
                    Login
                  </Button>
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