import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";

const Dashboard = () => {
  const [usageCount] = useState(3);
  const maxFreeSearches = 10;
  const remainingSearches = maxFreeSearches - usageCount;
  const usagePercentage = (usageCount / maxFreeSearches) * 100;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1 bg-gray-50 p-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-[#0177B5]">Your Dashboard</h1>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Usage Card */}
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Current Usage</h2>
                  <p className="text-gray-600">Free Plan</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>LinkedIn Profile Analyses</span>
                      <span>{usageCount} / {maxFreeSearches}</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-[#0177B5] font-medium">
                      {remainingSearches} free analyses remaining
                    </p>
                  </div>

                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      Basic LinkedIn profile analysis
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      Conversation starters
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      Basic insights
                    </li>
                  </ul>
                </div>
              </Card>

              {/* Upgrade Card */}
              <Card className="p-6 border-2 border-[#0177B5]">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Pro Plan</h2>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">€29</span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-600">
                    <Check className="w-5 h-5 text-[#0177B5] mr-2" />
                    Unlimited LinkedIn analyses
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check className="w-5 h-5 text-[#0177B5] mr-2" />
                    Advanced insights & recommendations
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check className="w-5 h-5 text-[#0177B5] mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check className="w-5 h-5 text-[#0177B5] mr-2" />
                    Download & export options
                  </li>
                </ul>

                <Button 
                  className="w-full bg-[#0177B5] hover:bg-[#0177B5]/90 text-white"
                  onClick={() => console.log('Upgrade clicked')}
                >
                  Upgrade Now
                </Button>
                
                <p className="text-sm text-gray-500 text-center mt-4">
                  Cancel anytime. No commitment required.
                </p>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;