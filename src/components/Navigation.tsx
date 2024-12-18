import { useEffect, useState } from 'react';
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
import DesktopMenu from './navigation/DesktopMenu';
import MobileMenu from './navigation/MobileMenu';

interface NavigationProps {
  onLoginClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick }) => {
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        console.log('Checking admin status for user:', session.user.email);
        const { data, error } = await supabase
          .from('users')
          .select('credits, is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin status:', error);
          return;
        }
        
        setIsAdmin(!!data?.is_admin);
        setCredits(data?.credits ?? 0);
        
        if (data?.is_admin) {
          console.log('Admin status confirmed for user:', session.user.email);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    fetchUserData();
  }, [session, supabase]);

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
      
      // Clear all session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Uitloggen mislukt",
          description: "Er is een fout opgetreden tijdens het uitloggen. Probeer het opnieuw.",
          variant: "destructive",
        });
        return;
      }

      // Reset state
      setIsAdmin(false);
      setCredits(null);

      console.log('Logout successful');
      toast({
        title: "Uitgelogd",
        description: "Je bent succesvol uitgelogd.",
      });
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Uitloggen mislukt",
        description: "Er is een onverwachte fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 border-b bg-white z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-brand-primary" />
              <span className="text-xl font-semibold text-brand-primary">LeadSummary</span>
            </Link>
          </div>

          <DesktopMenu 
            session={!!session}
            isAdmin={isAdmin}
            credits={credits}
            onLoginClick={onLoginClick}
            handleLogout={handleLogout}
          />

          <MobileMenu 
            isAuthenticated={!!session}
            isAdmin={isAdmin}
            onLoginClick={onLoginClick}
            handleLogout={handleLogout}
            credits={credits}
          />
        </div>
      </div>
    </header>
  );
};

export default Navigation;