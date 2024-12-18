import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import SignupFormFields from './SignupFormFields';
import SignupButton from './SignupButton';
import LoginLinks from './LoginLinks';
import useSignupValidation from './SignupValidation';
import { supabase } from "@/integrations/supabase/client";

interface SignupFormProps {
  onSuccess?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validateSignup } = useSignupValidation({ email, password });

  const handleSignup = async () => {
    console.log('Starting signup process for email:', email.trim());
    
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (signUpError) {
      console.error('Auth signup error:', signUpError);
      throw signUpError;
    }

    console.log('Auth signup response:', authData);

    if (!authData.user) {
      console.error('No user data returned after signup');
      throw new Error('No user data returned after signup');
    }

    console.log('Auth signup successful. User ID:', authData.user.id);

    console.log('Creating user record in users table...');
    const { error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          trial_start: new Date().toISOString(),
          credits: 10
        }
      ]);

    if (userError) {
      console.error('Error creating user record:', userError);
      throw userError;
    }

    console.log('User record created successfully');
    return authData.user;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignup()) return;

    setIsLoading(true);

    try {
      await handleSignup();
      
      toast({
        title: "Account aangemaakt",
        description: "Je account is succesvol aangemaakt. Check je email om je account te verifiëren!",
      });
      
      onSuccess?.();
      navigate('/');
      
    } catch (error: any) {
      console.error('Signup error details:', error);
      let errorMessage = "Er is een onverwachte fout opgetreden. Probeer het later opnieuw.";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "Dit e-mailadres is al geregistreerd. Probeer in te loggen.";
      }
      
      toast({
        title: "Registratie mislukt",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SignupFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
      />
      <SignupButton isLoading={isLoading} />
      <LoginLinks mode="signup" />
    </form>
  );
};

export default SignupForm;