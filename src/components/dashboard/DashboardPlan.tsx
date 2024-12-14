import React from 'react';
import { Card } from "@/components/ui/card";

const DashboardPlan = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0177B5]">Your Plan</h2>
      <Card className="p-6">
        <img 
          src="/Leadsummary.png" 
          alt="LeadSummary Plan" 
          className="w-full max-w-2xl mx-auto"
        />
      </Card>
    </div>
  );
};

export default DashboardPlan;