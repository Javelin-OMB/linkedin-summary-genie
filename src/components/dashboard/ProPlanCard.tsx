import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const ProPlanCard = () => {
  return (
    <Card className="p-6 border-2 border-primary">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pro Plan</h2>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">€29</span>
          <span className="text-gray-600 ml-1">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        <li className="flex items-center text-gray-600">
          <Check className="w-5 h-5 text-primary mr-2" />
          Unlimited LinkedIn analyses
        </li>
        <li className="flex items-center text-gray-600">
          <Check className="w-5 h-5 text-primary mr-2" />
          Advanced insights & recommendations
        </li>
        <li className="flex items-center text-gray-600">
          <Check className="w-5 h-5 text-primary mr-2" />
          Priority support
        </li>
        <li className="flex items-center text-gray-600">
          <Check className="w-5 h-5 text-primary mr-2" />
          Download & export options
        </li>
      </ul>

      <Button 
        className="w-full bg-gray-400 hover:bg-gray-500 text-white cursor-not-allowed"
        disabled
      >
        Soon Available
      </Button>
      
      <p className="text-sm text-gray-500 text-center mt-4">
        Cancel anytime. No commitment required.
      </p>
    </Card>
  );
};

export default ProPlanCard;
