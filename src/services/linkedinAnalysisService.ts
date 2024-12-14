import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  [key: string]: any;
}

export const analyzeLinkedInProfile = async (url: string, userId: string, currentCredits: number | null) => {
  console.log('Making API request with URL:', url);
  
  try {
    const response = await fetch('https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'd607c466-f207-4c47-907f-d928278273e2:sk-YjBhNjVmMjltZjg3Zi00ZjMyLWFlMWMtM2E1NDhiOWU4MmIw'
      },
      body: JSON.stringify({
        params: {
          linkedin_url: url
        },
        project: "d607c466-f207-4c47-907f-d928278273e2"
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