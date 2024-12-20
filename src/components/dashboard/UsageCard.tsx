import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

interface UsageCardProps {
  credits: number | null;
  isLoading: boolean;
  maxFreeSearches: number;
}

const UsageCard = ({ credits, isLoading, maxFreeSearches }: UsageCardProps) => {
  const usagePercentage = credits !== null ? ((maxFreeSearches - credits) / maxFreeSearches) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Usage</h2>
        <p className="text-gray-600">Free Plan</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>LinkedIn Profile Analyses</span>
            <span>{isLoading ? "Loading..." : `${credits} / ${maxFreeSearches}`}</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text font-medium">
            {isLoading ? "Loading..." : `${credits} analyses remaining`}
          </p>
        </div>

        <ul className="space-y-2">
          <li className="flex items-center text-gray-600">
            <Check className="w-5 h-5 text-primary mr-2" />
            Basic LinkedIn profile analysis
          </li>
          <li className="flex items-center text-gray-600">
            <Check className="w-5 h-5 text-primary mr-2" />
            Conversation starters
          </li>
          <li className="flex items-center text-gray-600">
            <Check className="w-5 h-5 text-primary mr-2" />
            Basic insights
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default UsageCard;
