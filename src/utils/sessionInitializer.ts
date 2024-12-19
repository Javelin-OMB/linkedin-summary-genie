import { NavigateFunction } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { safeNavigate } from './navigationUtils';

export const initializeUserSession = async (
  userId: string,
  email: string | undefined
) => {
  console.log('Verifying user record for:', email);
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (userError && userError.code !== 'PGRST116') {
    console.error('Error checking user:', userError);
    throw userError;
  }

  if (!userData) {
    console.log('Creating new user record');
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