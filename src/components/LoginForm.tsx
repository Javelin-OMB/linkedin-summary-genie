import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
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
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
        }

        console.log('User data after login:', userData);

        toast({
          title: "Success",
          description: "Login successful! Redirecting...",
        });
        
        onSuccess?.();
        
        // Always redirect to dashboard after successful login
        console.log('Redirecting to dashboard after successful login');
        navigate('/dashboard');
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};

export default LoginForm;