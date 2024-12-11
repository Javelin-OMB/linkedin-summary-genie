export const processWithRelevance = async (linkedinUrl: string): Promise<string> => {
  const apiKey = localStorage.getItem("relevance_api_key");
  
  if (!apiKey) {
    throw new Error("Please configure your Relevance API key first");
  }

  try {
    const response = await fetch('https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input_variables: {
          linkedin_url: linkedinUrl
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process with Relevance');
    }

    const data = await response.json();
    return data.output || 'No output available';
  } catch (error) {
    console.error('Relevance API Error:', error);
    throw new Error('Failed to process LinkedIn profile with Relevance');
  }
};