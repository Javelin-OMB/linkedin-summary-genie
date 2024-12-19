import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { LOADING_TIMEOUT } from '@/utils/constants';

export type AuthSession = {
  session: Session | null;
  user: User | null;
};

export type SessionCheckResult = {
  data: {
    session: Session | null;
  };
  error: Error | null;
};

// Type guard to ensure session is valid
export const isValidSession = (session: Session | null): session is Session => {
  return session !== null && typeof session === 'object' && 'user' in session;
};

export const checkSession = async (): Promise<SessionCheckResult> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Session check timed out'));
    }, LOADING_TIMEOUT);
  });

  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      timeoutPromise
    ]) as SessionCheckResult;

    return result;
  } catch (error) {
    throw error;
  }
};