import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

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
      console.log(`Starting ${mode} attempt for:`, trimmedEmail);
      
      let authResponse;
      if (mode === 'signup') {
        authResponse = await supabase.auth.signUp({
          email: trimmedEmail,
          password: password,
        });
      } else {
        authResponse = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password,
        });
      }

      const { data, error } = authResponse;

      if (error) {
        console.error(`Supabase ${mode} error:`, error.message);
        throw error;
      }

      console.log(`${mode} successful for user:`, data.user?.email);
      
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userError && mode === 'signup') {
          console.log('Creating new user record');
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                trial_start: new Date().toISOString(),
                credits: 10
              }
            ]);

          if (insertError) {
            console.error('Error creating user record:', insertError);
            throw new Error('Failed to create user record');
          }
        }

        toast({
          title: "Success",
          description: mode === 'login' 
            ? "Login successful! Redirecting..." 
            : "Account created successfully! Redirecting...",
        });
        
        onSuccess?.();
        
        console.log('Redirecting to homepage after successful login/signup');
        navigate('/');
      }
    } catch (error) {
      console.error(`${mode} error:`, error);
      toast({
        title: `${mode === 'login' ? 'Login' : 'Sign Up'} Failed`,
        description: error instanceof Error ? error.message : `Failed to ${mode}. Please try again.`,
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
        {isLoading ? (mode === 'login' ? "Signing in..." : "Creating account...") : (mode === 'login' ? "Sign in" : "Create Account")}
      </Button>
      <div className="space-y-2 text-center">
        {mode === 'login' ? (
          <>
            <a href="#" className="text-sm text-[#0177B5] hover:underline block">
              Forgot your password?
            </a>
            <a href="/pricing" className="text-sm text-[#0177B5] hover:underline block">
              Don't have an account? Sign up
            </a>
          </>
        ) : (
          <a href="#" className="text-sm text-[#0177B5] hover:underline block" onClick={() => navigate('/login')}>
            Already have an account? Sign in
          </a>
        )}
      </div>
    </form>
  );
};

export default LoginForm;