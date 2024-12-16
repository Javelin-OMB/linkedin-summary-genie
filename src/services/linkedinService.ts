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

// Cache voor recente analyses
const profileCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuten cache

export const fetchLinkedInProfile = async (url: string): Promise<any> => {
  console.log('Starting LinkedIn profile fetch for URL:', url);
  
  // Check cache first
  const cachedData = profileCache.get(url);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    console.log('Returning cached profile data');
    return cachedData.data;
  }

  try {
    console.log('Making API request to Relevance API...');
    
    // Optimaliseer de request door alleen essentiële data op te vragen
    const response = await fetch("https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'd607c466-f207-4c47-907f-d928278273e2:sk-MGYzZGM0YzQtNGJhNC00NDlkLWJlZjAtYzA4NjBlMGU0NGFl'
      },
      body: JSON.stringify({
        params: {
          linkedin_url: url.trim(),
          optimize_response: true // Extra parameter voor geoptimaliseerde response
        },
        project: "d607c466-f207-4c47-907f-d928278273e2"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response error status:', response.status);
      console.error('API Response error text:', errorText);
      
      if (response.status === 429) {
        throw new Error('Te veel verzoeken. Probeer het over een paar minuten opnieuw.');
      }
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Authenticatiefout met de API. Neem contact op met support.');
      }
      
      throw new Error(`API fout (${response.status}): ${errorText || 'Onbekende fout'}`);
    }

    const data = await response.json();
    console.log('API Response successful, data received:', data);
    
    if (!data || !data.output) {
      console.error('Invalid API response format:', data);
      throw new Error('Ongeldig responseformaat van API');
    }

    // Cache the result
    profileCache.set(url, { data, timestamp: Date.now() });

    return data;
  } catch (error) {
    console.error('LinkedIn API Error:', error);
    console.error('Full error details:', {
      message: error instanceof Error ? error.message : 'Onbekende fout',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Netwerkverbindingsfout. Controleer je internetverbinding en probeer het opnieuw.');
    }
    
    throw new Error(
      error instanceof Error 
        ? `Kon LinkedIn profiel niet analyseren: ${error.message}` 
        : 'Kon profiel niet analyseren. Probeer het opnieuw.'
    );
  }
};