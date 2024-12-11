export const processWithRelevance = async (linkedinUrl: string): Promise<string> => {
  const apiKey = localStorage.getItem("relevance_api_key");
  const endpoint = localStorage.getItem("relevance_endpoint");
  
  if (!apiKey || !endpoint) {
    throw new Error("Please configure your Relevance API credentials first");
  }

  try {
    console.log('Making request to Relevance API:', {
      endpoint,
      linkedinUrl
    });

    const response = await fetch(endpoint, {
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
      throw new Error('Failed to process with Relevance API');
    }

    const data = await response.json();
    console.log('Relevance API response:', data);
    
    return data.output || 'No output available';
  } catch (error) {
    console.error('Relevance API Error:', error);
    throw new Error('Error processing LinkedIn profile with Relevance');
  }
};