import Navigation from "@/components/Navigation";
import LeadSummary from "@/components/LeadSummary";
import SearchBar from "@/components/SearchBar";
import { useState, useEffect } from "react";
import LoginDialog from "@/components/LoginDialog";
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a recovery token in the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (accessToken && type === 'recovery') {
      console.log('Recovery token detected, redirecting to reset password page');
      // Preserve the complete hash in the URL when redirecting
      navigate('/reset-password' + window.location.hash);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onLoginClick={() => setIsLoginOpen(true)} />
      {!session && (
        <LoginDialog 
          isOpen={isLoginOpen}
          onOpenChange={setIsLoginOpen}
          mode="login"
        />
      )}
      <div className="container mx-auto px-4 pt-24">
        <LeadSummary />
        <div className="mt-2">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Index;