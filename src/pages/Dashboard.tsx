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
  const { toast } = useToast();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
      toast({
        title: "Laden duurt langer dan verwacht",
        description: "Probeer de pagina te verversen als dit blijft duren",
        variant: "destructive",
      });
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <SidebarProvider>
      <SessionHandler loadingTimeout={loadingTimeout} />
      <div className="flex min-h-screen w-full">
        <UserDataQuery loadingTimeout={loadingTimeout}>
          {(userData) => (
            <>
              <DashboardSidebar 
                onSectionChange={() => {}} 
                isAdmin={userData?.is_admin} 
              />
              <div className="flex-1 md:ml-64">
                <Navigation onLoginClick={() => {}} />
                <main className="bg-gray-50 min-h-screen p-4 pt-20">
                  <div className="max-w-6xl mx-auto">
                    <DashboardContent userData={userData} />
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