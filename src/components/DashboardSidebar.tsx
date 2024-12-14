import { LayoutDashboard, Settings, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User, Linkedin } from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings"
  },
  {
    title: "Plan",
    icon: CreditCard,
    path: "/plan"
  }
];

const DashboardSidebar = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchAnalyses = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('linkedin_analyses')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching analyses:', error);
          return;
        }

        setAnalyses(data || []);
      } catch (error) {
        console.error('Error in fetchAnalyses:', error);
      }
    };

    fetchAnalyses();
  }, [session, supabase]);

  const renderProfileSummary = (analysis: any) => {
    const profileData = analysis.analysis?.output?.profile_data;
    if (!profileData) return null;

    const sections = profileData.split('\n\n');
    const profileInfo = sections[0]?.split('\n') || [];
    const name = profileInfo[1]?.replace('- ', '') || 'Name not available';

    return (
      <div key={analysis.id} className="mb-4">
        <Link 
          to={`/dashboard/analysis/${analysis.id}`} 
          className="flex items-start p-2 hover:bg-gray-100 rounded-md group"
        >
          <div className="flex items-center space-x-3">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium">{name}</h3>
              <a 
                href={analysis.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="h-3 w-3 mr-1" />
                View Profile
              </a>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Analyses</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2">
            {analyses.length > 0 ? (
              analyses.map((analysis) => renderProfileSummary(analysis))
            ) : (
              <p className="text-sm text-gray-500 px-2">No analyses yet</p>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;