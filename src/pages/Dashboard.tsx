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

const Dashboard = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCredits = async () => {
      if (!session?.user?.id) return;

      try {
        console.log('Fetching credits for user:', session.user.id);
        const { data, error } = await supabase
          .from('users')
          .select('credits')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching credits:', error);
          toast({
            title: "Error",
            description: "Could not load credits information",
            variant: "destructive",
          });
          return;
        }

        console.log('Fetched credits:', data);
        setCredits(data?.credits ?? 0);
      } catch (error) {
        console.error('Error in fetchCredits:', error);
      }
    };

    fetchCredits();
  }, [session, supabase, toast]);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            <h1 className="text-2xl font-bold mb-6 text-[#0177B5]">Your Dashboard</h1>
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