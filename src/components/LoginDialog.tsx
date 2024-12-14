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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        console.error('Supabase login error:', error.message);
        throw error;
      }

      console.log('Login successful for user:', data.user?.email);
      
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('trial_start')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
        }

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
      }
    } catch (error) {
      console.error('Login error:', error);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#0177B5] hover:bg-[#0177B5]/90"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="space-y-2 text-center">
            <a href="#" className="text-sm text-[#0177B5] hover:underline block">
              Forgot your password?
            </a>
            <a href="/pricing" className="text-sm text-[#0177B5] hover:underline block">
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;