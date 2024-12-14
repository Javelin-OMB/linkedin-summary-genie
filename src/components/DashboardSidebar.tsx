import React from 'react';
import { Link } from "react-router-dom";
import { LayoutDashboard, CreditCard, History, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  onSectionChange: (section: string) => void;
  isAdmin?: boolean;
}

const DashboardSidebar = ({ onSectionChange, isAdmin }: DashboardSidebarProps) => {
  const menuItems = [
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
    <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 bg-white border-r z-40">
      <div className="flex-1 overflow-y-auto py-4 px-3 pt-20">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.section}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSectionChange(item.section)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          ))}
          {isAdmin && (
            <Link to="/admin">
              <Button
                variant="ghost"
                className="w-full justify-start text-[#0177B5]"
              >
                <Users className="mr-2 h-4 w-4" />
                Admin Panel
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;