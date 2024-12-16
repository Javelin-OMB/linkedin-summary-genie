interface LinkedInProfile {
  name: string;
  headline: string;
  summary: string;
  discProfile: {
    type: string;
    characteristics: string[];
    talkingPoints: string[];
  };
  recentPosts: string[];
}

export const fetchLinkedInProfile = async (url: string): Promise<any> => {
  console.log('Starting LinkedIn profile fetch for URL:', url);
  
  try {
    console.log('Making API request to Relevance API...');
    const response = await fetch("https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'd607c466-f207-4c47-907f-d928278273e2:sk-MGYzZGM0YzQtNGJhNC00NDlkLWJlZjAtYzA4NjBlMGU0NGFl'
      },
      body: JSON.stringify({
        params: {
          linkedin_url: url.trim() // Trim any whitespace from the URL
        },
        project: "d607c466-f207-4c47-907f-d928278273e2"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response error status:', response.status);
      console.error('API Response error text:', errorText);
      
      if (response.status === 429) {
        throw new Error('Too many requests. Please try again in a few minutes.');
      }
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication error with the API. Please contact support.');
      }
      
      throw new Error(`API error (${response.status}): ${errorText || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('API Response successful, data received:', data);
    
    if (!data || !data.output) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid response format from API');
    }

    return data;
  } catch (error) {
    console.error('LinkedIn API Error:', error);
    console.error('Full error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Provide more user-friendly error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network connection error. Please check your internet connection and try again.');
    }
    
    throw new Error(
      error instanceof Error 
        ? `Failed to analyze LinkedIn profile: ${error.message}` 
        : 'Failed to analyze LinkedIn profile. Please try again.'
    );
  }
};