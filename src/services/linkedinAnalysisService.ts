import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  [key: string]: any;
}

export const analyzeLinkedInProfile = async (url: string, userId: string, currentCredits: number | null) => {
  console.log('Starting LinkedIn profile analysis...');
  console.log('URL:', url);
  console.log('User ID:', userId);
  console.log('Current credits:', currentCredits);
  
  try {
    console.log('Making API request to Relevance...');
    const response = await fetch("https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'd607c466-f207-4c47-907f-d928278273e2:sk-MGYzZGM0YzQtNGJhNC00NDlkLWJlZjAtYzA4NjBlMGU0NGFl'
      },
      body: JSON.stringify({
        params: {
          linkedin_url: url
        },
        project: "d607c466-f207-4c47-907f-d928278273e2"
      })
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Relevance API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);

    // Store analysis in Supabase
    console.log('Storing analysis in Supabase...');
    const { error: analysisError } = await supabase
      .from('linkedin_analyses')
      .insert({
        linkedin_url: url,
        analysis: data,
        user_id: userId
      });

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
      throw new Error('Failed to store analysis in database');
    }

    // Decrease credits
    if (currentCredits !== null) {
      console.log('Updating user credits...');
      const { error: updateError } = await supabase
        .from('users')
        .update({ credits: currentCredits - 1 })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating credits:', updateError);
        throw new Error('Failed to update credits');
      }
      console.log('Credits updated successfully');
    }

    console.log('Analysis completed successfully');
    return data;
  } catch (error) {
    console.error('LinkedIn Analysis Error:', error);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze LinkedIn profile');
  }
};