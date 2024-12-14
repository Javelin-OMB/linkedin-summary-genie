import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  [key: string]: any;
}

export const analyzeLinkedInProfile = async (url: string, userId: string, currentCredits: number | null) => {
  console.log('Making API request with URL:', url);
  
  try {
    // Get the API key and endpoint from Supabase Edge Function
    const response = await fetch('/api/analyze-linkedin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        linkedin_url: url
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Store analysis in Supabase
    const { error: analysisError } = await supabase
      .from('linkedin_analyses')
      .insert({
        linkedin_url: url,
        analysis: data,
        user_id: userId
      });

    if (analysisError) {
      console.error('Error storing analysis:', analysisError);
    }

    // Decrease credits
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: (currentCredits || 0) - 1 })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      throw new Error('Failed to update credits');
    }

    return data;
  } catch (error) {
    console.error('LinkedIn Analysis Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze LinkedIn profile');
  }
};