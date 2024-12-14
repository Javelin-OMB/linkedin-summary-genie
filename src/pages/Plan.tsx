import React from 'react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Plan = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    toast.info("Pro plan coming soon! Stay tuned for updates.", {
      duration: 5000,
    });
    
    // Redirect back to dashboard after showing message
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onLoginClick={() => console.log('Login clicked')} />
      <div className="max-w-6xl mx-auto p-4 pt-20">
        <h1 className="text-2xl font-bold text-[#0177B5]">Pro Plan</h1>
        <p className="mt-4 text-gray-600">Our Pro plan features are coming soon...</p>
      </div>
    </div>
  );
};

export default Plan;