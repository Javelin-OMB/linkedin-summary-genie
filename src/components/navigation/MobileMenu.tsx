import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import MobileMenuLinks from './MobileMenuLinks';

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
          <Button variant="ghost" size="icon" className="text-brand-primary">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <MobileMenuLinks 
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            credits={credits}
            onLoginClick={onLoginClick}
            handleLogout={handleLogout}
            onClose={() => setIsOpen(false)}
            navigate={navigate}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;