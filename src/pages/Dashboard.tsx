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
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Use React Query for data fetching
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['userData', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('No session found');
      }
      
      console.log('Fetching user data for:', session.user.email);
      const { data, error } = await supabase
        .from('users')
        .select('credits, is_admin')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 1
  });

  useEffect(() => {
    if (!session?.user) {
      console.log('No session found, redirecting to login');
      navigate('/login');
    }
  }, [session, navigate]);

  if (!session) {
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading user data..." />;
  }

  if (error) {
    toast({
      title: "Error",
      description: "Could not load user data. Please try refreshing the page.",
      variant: "destructive",
    });
    return null;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-[#0177B5]">Your Dashboard</h1>
              {userData?.is_admin && (
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
                  Available credits: {userData?.credits ?? '...'}
                </p>
              </div>
            )}
            <DashboardOverview credits={userData?.credits} />
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
        <DashboardSidebar onSectionChange={setActiveSection} isAdmin={userData?.is_admin} />
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