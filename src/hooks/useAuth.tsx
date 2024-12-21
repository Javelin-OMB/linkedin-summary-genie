import { useState, useEffect, useCallback } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { User } from '../types/user';
import { checkAdminStatus, getCurrentUser } from '../services/authService';

interface AuthState {
  isAdmin: boolean;
  user: User | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const session = useSession();
  const [state, setState] = useState<AuthState>({
    isAdmin: false,
    user: null,
    isLoading: true
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!session?.user?.id) {
        setState({ isAdmin: false, user: null, isLoading: false });
        return;
      }

      try {
        const [isAdmin, user] = await Promise.all([
          checkAdminStatus(session.user.id),
          getCurrentUser(session.user.id)
        ]);

        setState({
          isAdmin,
          user,
          isLoading: false
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadUserData();
  }, [session]);

  const requireAdmin = useCallback(async () => {
    if (!session?.user?.id) {
      throw new Error('Authentication required');
    }

    const isAdmin = await checkAdminStatus(session.user.id);
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    return true;
  }, [session]);

  return {
    isAuthenticated: !!session,
    isAdmin: state.isAdmin,
    user: state.user,
    isLoading: state.isLoading,
    requireAdmin,
    userId: session?.user?.id,
    userEmail: session?.user?.email
  };
};
