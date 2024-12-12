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

export const fetchLinkedInProfile = async (url: string): Promise<LinkedInProfile> => {
  try {
    const response = await fetch("https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'd607c466-f207-4c47-907f-d928278273e2:sk-OTQ1ODVjYTQtOGZhYS00MDUwLWIxYWYtOTE0NDIyYTA1YjY2'
      },
      body: JSON.stringify({
        params: {
          linkedin_url: url
        },
        project: "d607c466-f207-4c47-907f-d928278273e2"
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch LinkedIn profile: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the API response to match our interface
    return {
      name: data.name || 'Unknown Name',
      headline: data.headline || 'No Headline Available',
      summary: data.summary || 'No Summary Available',
      discProfile: {
        type: data.disc_profile?.type || 'D',
        characteristics: data.disc_profile?.characteristics || [],
        talkingPoints: data.disc_profile?.talking_points || []
      },
      recentPosts: data.recent_posts || []
    };
  } catch (error) {
    console.error('LinkedIn API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch LinkedIn profile');
  }
};