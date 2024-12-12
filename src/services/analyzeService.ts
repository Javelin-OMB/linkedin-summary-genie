const RELEVANCE_API_URL = 'https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited';
const API_KEY = 'd607c466-f207-4c47-907f-d928278273e2:sk-OTQ1ODVjYTQtOGZhYS00MDUwLWIxYWYtOTE0NDIyYTA1YjY2';
const PROJECT_ID = 'd607c466-f207-4c47-907f-d928278273e2';

export const analyzeProfile = async (linkedinUrl: string) => {
  try {
    const response = await fetch(RELEVANCE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY
      },
      body: JSON.stringify({
        params: {
          linkedin_url: linkedinUrl
        },
        project: PROJECT_ID
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing profile:', error);
    throw error;
  }
};