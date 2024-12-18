import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';
import PasswordResetForm from './PasswordResetForm';
import { usePasswordReset } from '@/hooks/usePasswordReset';

const ResetPassword = () => {
  const [initializing, setInitializing] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, handlePasswordReset } = usePasswordReset();

  useEffect(() => {
    const initializePasswordReset = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        console.log('Initializing password reset with type:', type);
        
        if (!accessToken || type !== 'recovery') {
          console.error('Invalid or missing recovery token');
          toast({
            title: "Ongeldige link",
            description: "Deze wachtwoord reset link is ongeldig of verlopen.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        // Set the session with the recovery token
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          console.error('Error setting session:', error);
          throw error;
        }

        setIsValidToken(true);
        console.log('Token validated successfully');
      } catch (error) {
        console.error('Error in initializePasswordReset:', error);
        toast({
          title: "Fout",
          description: "Er is een fout opgetreden. Probeer het opnieuw.",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setInitializing(false);
      }
    };

    initializePasswordReset();
  }, [navigate, toast]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Even geduld..." />
      </div>
    );
  }

  if (!isValidToken) {
    return null; // The user will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Nieuw wachtwoord instellen
        </h1>
        <PasswordResetForm 
          onSubmit={handlePasswordReset}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ResetPassword;