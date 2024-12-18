import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have an access token in the URL
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token=')) {
      toast({
        title: "Ongeldige link",
        description: "Deze wachtwoord reset link is ongeldig of verlopen.",
        variant: "destructive",
      });
      navigate('/login');
    }
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
        description: "Je wachtwoord is succesvol gewijzigd. Je kunt nu inloggen.",
      });
      
      navigate('/login');
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
            className="w-full bg-brand-primary hover:bg-brand-hover text-white"
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