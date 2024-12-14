import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Index from "./pages/Index";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Plan from "./pages/Plan";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!session) {
      console.log('No session found, redirecting to login');
      navigate('/login');
    } else {
      console.log('Session found:', session.user.email);
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

// Session handler component
const SessionHandler = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Current session state:', session?.user?.email);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', currentSession?.user?.email);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Check if user exists in our users table
        const { data: userData } = await supabase
          .from('users')
          .select('trial_start')
          .eq('id', currentSession?.user?.id)
          .single();

        if (!userData?.trial_start) {
          // New user - redirect to pricing
          console.log('New user - redirecting to pricing');
          navigate('/pricing');
        } else {
          // Existing user - redirect to dashboard
          console.log('Existing user - redirecting to dashboard');
          navigate('/dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        navigate('/login');
      }
    });

    // If there's already a session, redirect appropriately
    if (session?.user?.id) {
      console.log('Existing session found, checking user data');
      const checkUserAndRedirect = async () => {
        const { data: userData } = await supabase
          .from('users')
          .select('trial_start')
          .eq('id', session.user.id)
          .single();

        if (!userData?.trial_start) {
          console.log('New user with session - redirecting to pricing');
          navigate('/pricing');
        } else {
          console.log('Existing user with session - redirecting to dashboard');
          navigate('/dashboard');
        }
      };

      checkUserAndRedirect();
    }

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, session]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionHandler />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;
