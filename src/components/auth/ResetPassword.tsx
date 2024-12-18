import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
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

        const { data: { session }, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error || !session) {
          console.error('Error setting session:', error);
          toast({
            title: "Sessie fout",
            description: "Er is een fout opgetreden bij het verifiëren van je reset link.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        setInitializing(false);
      } catch (error) {
        console.error('Error in handlePasswordReset:', error);
        toast({
          title: "Fout",
          description: "Er is een fout opgetreden. Probeer het opnieuw.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    handlePasswordReset();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Wachtwoord gewijzigd",
        description: "Je wachtwoord is succesvol gewijzigd. Je wordt nu doorgestuurd naar de inlogpagina.",
      });
      
      // Sign out the user after password reset
      await supabase.auth.signOut();
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Fout bij wachtwoord wijzigen",
        description: error.message || "Er is een fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Even geduld..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Nieuw wachtwoord instellen
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nieuw wachtwoord
            </label>
            <Input
              id="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Vul je nieuwe wachtwoord in"
              required
              minLength={6}
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-hover text-black"
            disabled={loading}
          >
            {loading ? "Bezig met wijzigen..." : "Wachtwoord wijzigen"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;