import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { fetchUsers, addUserToDatabase, updateUserInDatabase } from '@/services/userService';
import type { NewUser, User } from '@/types/user';

export const useAdminUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: users, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addUser = async (userData: NewUser) => {
    setIsLoading(true);
    try {
      const data = await addUserToDatabase({
        ...userData,
        is_admin: false, // Set default value for new users
      });

      toast({
        title: "Success",
        description: "User added successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: error.message || "Could not add user",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    setIsLoading(true);
    try {
      const data = await updateUserInDatabase(id, updates);

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "Could not update user",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users: users || [],
    isLoading,
    error,
    refetch,
    addUser,
    updateUser,
  };
};