import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { LayoutDashboard, CreditCard, History, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardSidebarProps {
  onSectionChange: (section: string) => void;
  isAdmin?: boolean;
}

const DashboardSidebar = ({ onSectionChange, isAdmin }: DashboardSidebarProps) => {
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const session = useSession();
  const supabase = useSupabaseClient();

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

  useEffect(() => {
    const fetchRecentAnalyses = async () => {
      if (!session?.user?.id) return;

      try {
        console.log('Fetching recent analyses for sidebar');
        const { data, error } = await supabase
          .from('linkedin_analyses')
          .select('analysis, linkedin_url')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching recent analyses:', error);
          return;
        }

        setRecentAnalyses(data || []);
      } catch (error) {
        console.error('Error in fetchRecentAnalyses:', error);
      }
    };

    fetchRecentAnalyses();
  }, [session, supabase]);

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

        {session && recentAnalyses.length > 0 && (
          <div className="mt-6">
            <h3 className="px-3 text-sm font-medium text-gray-500 mb-2">Recent Analyses</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-1">
                {recentAnalyses.map((analysis, index) => {
                  const name = analysis.analysis?.output?.profile_data?.split('\n')[1]?.replace('- ', '') || 'Unknown Profile';
                  return (
                    <a
                      key={index}
                      href={analysis.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md truncate"
                    >
                      {name}
                    </a>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSidebar;