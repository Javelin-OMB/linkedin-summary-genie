import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import Navigation from "@/components/Navigation";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import DashboardAnalyses from '@/components/dashboard/DashboardAnalyses';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import DashboardPlan from '@/components/dashboard/DashboardPlan';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        setIsAdmin(!!data?.is_admin);
        if (data?.is_admin) {
          console.log('User is admin:', session.user.email);
          toast({
            title: "Admin Access",
            description: "Je bent ingelogd als administrator",
          });
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    const fetchCredits = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('credits')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        console.log('Fetched credits:', data?.credits);
        setCredits(data?.credits ?? 0);
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    // Run both checks
    checkAdminStatus();
    fetchCredits();
  }, [session, supabase, toast]);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold text-[#0177B5]">Your Dashboard</h1>
              {isAdmin && (
                <Badge variant="secondary" className="bg-[#0177B5] text-white">
                  Administrator
                </Badge>
              )}
            </div>
            {session?.user?.email && (
              <div className="space-y-2 mb-6">
                <p className="text-gray-600">
                  Ingelogd als: {session.user.email}
                </p>
                <p className="text-gray-600 font-medium">
                  Beschikbare credits: {credits !== null ? credits : '...'}
                </p>
              </div>
            )}
            <DashboardOverview credits={credits} />
          </>
        );
      case 'plan':
        return <DashboardPlan />;
      case 'analyses':
        return <DashboardAnalyses />;
      case 'settings':
        return <DashboardSettings />;
      default:
        return (
          <>
            <h1 className="text-2xl font-bold mb-6 text-[#0177B5]">Your Dashboard</h1>
            <DashboardOverview credits={credits} />
          </>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar onSectionChange={setActiveSection} />
        <div className="flex-1">
          <Navigation onLoginClick={() => navigate('/login')} />
          <main className="bg-gray-50 p-4 pt-20">
            <div className="max-w-6xl mx-auto">
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;