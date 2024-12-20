import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import Navigation from "@/components/Navigation";
import SessionHandler from '@/components/dashboard/SessionHandler';
import UserDataQuery from '@/components/dashboard/UserDataQuery';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useToast } from "@/components/ui/use-toast";
const Dashboard = () => {
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const { toast } = useToast();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
      toast({
        title: "Laden duurt langer dan verwacht",
        description: "Probeer de pagina te verversen als dit blijft duren",
        variant: "destructive",
      });
    }, 10000); // Increased to 10 seconds to allow for data loading

    return () => clearTimeout(timeoutId);
  }, [toast]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <SidebarProvider>
      <SessionHandler loadingTimeout={loadingTimeout} />
      <div className="flex min-h-screen w-full">
        <UserDataQuery loadingTimeout={loadingTimeout}>
          {(userData) => (
            <>
              <DashboardSidebar 
                onSectionChange={handleSectionChange}
                isAdmin={userData?.is_admin} 
              />
              <div className="flex-1 md:ml-64">
                <Navigation onLoginClick={() => {}} />
                <main className="bg-gray-50 min-h-screen p-4 pt-20">
                  <div className="max-w-6xl mx-auto">
                    <DashboardContent 
                      userData={userData} 
                      activeSection={activeSection}
                    />
                  </div>
                </main>
              </div>
            </>
          )}
        </UserDataQuery>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
