import Navbar from "@/components/Navbar";
import LeadSummary from "@/components/LeadSummary";
import SearchBar from "@/components/SearchBar";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');
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

      console.log('Logout successful');
      toast({
        title: "Uitgelogd",
        description: "Je bent succesvol uitgelogd.",
      });
      navigate('/');
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Uitloggen
          </Button>
        </div>
        <LeadSummary />
        <div className="mt-2">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Index;