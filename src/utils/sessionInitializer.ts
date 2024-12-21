import { NavigateFunction } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { safeNavigate } from './navigationUtils';

export const initializeUserSession = async (
  userId: string,
  email: string | undefined
) => {
  console.log('Verifying user record for:', email);
  
  // First check if user's email is verified
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error('Error getting user:', userError);
    throw userError;
  }

  if (!user?.email_confirmed_at) {
    console.log('Email not verified yet');
    throw new Error('Please verify your email address before proceeding.');
  }

  // Check if user record exists
  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (userDataError && userDataError.code !== 'PGRST116') {
    console.error('Error checking user:', userDataError);
    throw userDataError;
  }

  // Only create user record if email is verified and record doesn't exist
  if (!userData) {
    console.log('Creating new user record for verified user');
    const { error: insertError } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email: email,
        trial_start: new Date().toISOString(),
        credits: 10
      }]);

    if (insertError) {
      console.error('Error creating user record:', insertError);
      throw insertError;
    }
  }
};

export const handleSessionNavigation = async (
  navigate: NavigateFunction,
  currentPath: string
) => {
  if (currentPath !== '/dashboard') {
    console.log('Navigating to dashboard...');
    await safeNavigate(navigate, '/dashboard', { replace: true });
  }
};
