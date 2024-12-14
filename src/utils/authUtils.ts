import { supabase } from "@/integrations/supabase/client";

export const ensureUserRecord = async (userId: string, userEmail: string) => {
  console.log('Checking for existing user record...');
  
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (checkError) {
      console.log('Error checking user record:', checkError);
      console.log('Creating new user record...');
      
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email: userEmail,
            trial_start: new Date().toISOString(),
            credits: 10,
            is_admin: userEmail === 'tom.spoor@ombdigital.io' // Set admin for specific email
          }
        ]);

      if (insertError) {
        console.error('Error creating user record:', insertError);
        throw new Error('Failed to create user record');
      }
      console.log('User record created successfully');
    } else {
      console.log('Existing user record found:', existingUser);
    }
  } catch (error) {
    console.error('Error in ensureUserRecord:', error);
    throw error;
  }
};

export const validateLoginInputs = (email: string, password: string) => {
  const errors: string[] = [];
  
  if (!email.trim()) {
    errors.push("Email is required");
  }
  
  if (!password) {
    errors.push("Password is required");
  }
  
  return errors;
};