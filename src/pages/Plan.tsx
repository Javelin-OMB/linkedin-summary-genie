import React from 'react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Plan = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Show toast message immediately when component mounts
    toast("Pro plan coming soon!", {
      description: "Stay tuned for updates about our Pro features.",
      duration: 3000,
    });
    
    // Redirect back to dashboard after showing message
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
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