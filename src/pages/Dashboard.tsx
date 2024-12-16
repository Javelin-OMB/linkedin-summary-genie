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
import LoadingSpinner from '@/components/LoadingSpinner';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching user data for:', session.user.email);
        
        const { data, error } = await supabase
          .from('users')
          .select('credits, is_admin')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          toast({
            title: "Error",
            description: "Could not load user data",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          console.log('User data loaded:', data);
          setIsAdmin(data.is_admin || false);
          setCredits(data.credits || 0);
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, supabase, toast]);

  const renderSection = () => {
    if (isLoading) {
      return <LoadingSpinner message="Loading user data..." />;
    }

    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-[#0177B5]">Your Dashboard</h1>
              {isAdmin && (
                <Badge variant="secondary" className="bg-[#0177B5] text-white">
                  Administrator
                </Badge>
              )}
            </div>
            {session?.user?.email && (
              <div className="space-y-2">
                <p className="text-gray-600">
                  Logged in as: {session.user.email}
                </p>
                <p className="text-gray-600 font-medium">
                  Available credits: {credits !== null ? credits : '...'}
                </p>
              </div>
            )}
            <DashboardOverview credits={credits} />
            {isMobile && <DashboardAnalyses />}
          </div>
        );
      case 'plan':
        return <DashboardPlan />;
      case 'analyses':
        return <DashboardAnalyses />;
      case 'settings':
        return <DashboardSettings />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar onSectionChange={setActiveSection} isAdmin={isAdmin} />
        <div className="flex-1 md:ml-64">
          <Navigation onLoginClick={() => navigate('/login')} />
          <main className="bg-gray-50 min-h-screen p-4 pt-20">
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