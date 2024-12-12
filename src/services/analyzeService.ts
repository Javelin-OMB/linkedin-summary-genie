export const analyzeProfile = async (linkedin_url: string) => {
  try {
    const response = await fetch('https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'd607c466-f207-4c47-907f-d928278273e2:sk-OTQ1ODVjYTQtOGZhYS00MDUwLWIxYWYtOTE0NDIyYTA1YjY2'
      },
      body: JSON.stringify({
        params: { linkedin_url },
        project: "d607c466-f207-4c47-907f-d928278273e2"
      })
    });

    if (!response.ok) {
      throw new Error('Er ging iets mis bij het ophalen van de gegevens');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing profile:', error);
    throw error;
  }
};