import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { ensureUserRecord, validateLoginInputs } from '@/utils/authUtils';
import LoginLinks from './auth/LoginLinks';

interface LoginFormProps {
  onSuccess?: () => void;
  mode?: 'login' | 'signup';
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, mode = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateLoginInputs(email, password);
    if (errors.length > 0) {
      errors.forEach(error => {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      });
      return;
    }

    setIsLoading(true);
    const trimmedEmail = email.trim();
    console.log(`Starting ${mode} attempt for:`, trimmedEmail);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { email: trimmedEmail }
          }
        });

        if (error) throw error;

        if (data.user) {
          await ensureUserRecord(data.user.id, data.user.email || trimmedEmail);
          toast({
            title: "Success",
            description: "Account created! Please check your email for confirmation.",
          });
          onSuccess?.();
          navigate('/dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "Success",
            description: "Login successful! Redirecting...",
          });
          onSuccess?.();
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error(`${mode} error:`, error);
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid login credentials. Please check your email and password.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Email not confirmed. Please check your inbox for the confirmation link.";
      }
      
      toast({
        title: `${mode === 'login' ? 'Login' : 'Registration'} failed`,
        description: errorMessage,
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
        <label className="text-sm font-medium">Password</label>
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
        {isLoading 
          ? (mode === 'login' ? "Logging in..." : "Creating account...") 
          : (mode === 'login' ? "Login" : "Create account")}
      </Button>
      <LoginLinks mode={mode} />
    </form>
  );
};

export default LoginForm;