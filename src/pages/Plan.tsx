import React from 'react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const Plan = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    toast("Pro plan coming soon!", {
      description: "Stay tuned for updates about our Pro features.",
      duration: 3000,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onLoginClick={() => console.log('Login clicked')} />
      <div className="max-w-6xl mx-auto p-4 pt-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Pro Plan</h1>
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold">€29</span>
              <span className="text-gray-600 ml-1">/month</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" 
              alt="Pro Plan Features" 
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <p className="mt-4 text-gray-600">
              Upgrade to our Pro plan to unlock unlimited analyses and advanced features.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Plan;