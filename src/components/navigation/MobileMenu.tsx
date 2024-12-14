import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import DashboardSections from './DashboardSections';

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isDashboardRoute: boolean;
  onSectionChange?: (section: string) => void;
}

const MobileMenu = ({
  isOpen,
  onOpenChange,
  isLoggedIn,
  isAdmin,
  isDashboardRoute,
  onSectionChange
}: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-linkedin-primary">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col space-y-4">
          {isLoggedIn && (
            <>
              <Link to="/dashboard" className="text-lg hover:text-linkedin-primary">Dashboard</Link>
              {isAdmin && (
                <Link to="/admin" className="text-lg hover:text-linkedin-primary">Admin</Link>
              )}
              {isDashboardRoute && onSectionChange && (
                <DashboardSections 
                  onSectionChange={onSectionChange} 
                  onClose={() => onOpenChange(false)}
                />
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;