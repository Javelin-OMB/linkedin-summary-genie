import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  LogIn, 
  UserPlus,
  LayoutDashboard,
  CreditCard,
  History,
  Settings 
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLoginClick: () => void;
  onSectionChange?: (section: string) => void;
  isDashboardRoute: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isAuthenticated,
  isAdmin,
  onLoginClick,
  onSectionChange,
  isDashboardRoute
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  const handleSectionClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
      setIsSheetOpen(false);
    }
  };

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

  return (
    <div className="md:hidden">
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
            {isAuthenticated && (
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
            {!isAuthenticated && (
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  onClick={onLoginClick}
                  className="w-full justify-center"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/login?mode=signup')}
                  className="w-full justify-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
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