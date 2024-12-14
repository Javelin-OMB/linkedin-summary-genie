import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateInputs = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return false;
    }
    if (!password) {
      toast({
        title: "Error",
        description: "Password is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    try {
      setIsLoading(true);
      const trimmedEmail = email.trim();
      console.log('Starting login attempt for:', trimmedEmail);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Current session before login:', sessionData?.session?.user?.email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        console.error('Supabase login error:', error.message);
        throw error;
      }

      console.log('Raw login response:', data);

      if (data.user) {
        console.log('Login successful for user:', data.user.email);
        console.log('User ID:', data.user.id);
        
        // Check if user exists in our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('trial_start, email')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          // Continue anyway since the auth was successful
        }

        console.log('User data from database:', userData);

        // Verify the session was created
        const { data: newSessionData } = await supabase.auth.getSession();
        console.log('New session after login:', newSessionData?.session?.user?.email);

        toast({
          title: "Success",
          description: "Login successful! Redirecting...",
        });
        
        onOpenChange(false);
        
        if (!userData?.trial_start) {
          console.log('New user - redirecting to pricing');
          navigate('/pricing');
        } else {
          console.log('Existing user - redirecting to dashboard');
          navigate('/dashboard');
        }
      } else {
        console.error('No user data in response');
        throw new Error('Login successful but no user data received');
      }
    } catch (error) {
      console.error('Login error details:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to login. Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login to LeadSummary</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-linkedin-primary hover:bg-linkedin-hover"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <div className="text-center text-sm text-gray-500">
            Don't have an account? <a href="/pricing" className="text-linkedin-primary hover:underline cursor-pointer">Sign up</a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;