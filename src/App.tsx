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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Protected Route - Current session:', currentSession?.user?.email);
        
        if (!currentSession) {
          console.log('No session found in ProtectedRoute, redirecting to login');
          toast({
            title: "Authentication required",
            description: "Please log in to access this page",
            variant: "destructive",
          });
          navigate('/login');
        } else {
          console.log('Session found in ProtectedRoute');
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }

          console.log('User data in ProtectedRoute:', userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session state:', currentSession?.user?.email);
        
        if (currentSession?.user?.id) {
          console.log('Session found, checking user data');
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }

          console.log('User data:', userData);
          
          if (userData) {
            console.log('Existing user - redirecting to dashboard');
            navigate('/dashboard');
          } else {
            console.log('No user data found - redirecting to pricing');
            navigate('/pricing');
          }
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', currentSession?.user?.email);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        if (currentSession?.user?.id) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }

          console.log('User data after sign in:', userData);
          
          if (userData) {
            console.log('Existing user - redirecting to dashboard');
            navigate('/dashboard');
          } else {
            console.log('New user - redirecting to pricing');
            navigate('/pricing');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        toast({
          title: "Signed out",
          description: "You have been logged out successfully",
        });
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

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