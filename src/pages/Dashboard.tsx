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
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
  }, []);

  // Redirect if no session
  useEffect(() => {
    if (!session && loadingTimeout) {
      console.log('No session found after timeout, redirecting to login');
      navigate('/login');
      toast({
        title: "Sessie verlopen",
        description: "Log opnieuw in om door te gaan",
        variant: "destructive",
      });
    }
  }, [session, loadingTimeout, navigate, toast]);

  // Use React Query for data fetching with better error handling
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

      if (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No user data found');
        throw new Error('User data not found');
      }

      return data;
    },
    enabled: !!session?.user?.id,
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 1,
    retryDelay: 1000
  });

  // Show loading state with timeout message
  if (isLoading) {
    return (
      <LoadingSpinner 
        message={loadingTimeout ? 
          "Het laden duurt langer dan verwacht. Ververs de pagina als dit blijft duren." : 
          "Dashboard laden..."
        } 
      />
    );
  }

  // Show error state
  if (error) {
    console.error('Dashboard error:', error);
    toast({
      title: "Error",
      description: "Er ging iets mis bij het laden van je gegevens. Probeer de pagina te verversen.",
      variant: "destructive",
    });
    return null;
  }

  // If no session and timeout reached, return null (useEffect will handle redirect)
  if (!session && loadingTimeout) {
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