export const processWithRelevance = async (linkedinUrl: string): Promise<string> => {
  const apiKey = localStorage.getItem("relevance_api_key");
  const endpoint = localStorage.getItem("relevance_endpoint");
  
  if (!apiKey || !endpoint) {
    throw new Error("Configureer eerst je Relevance API gegevens");
  }

  try {
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
      throw new Error('Fout bij verwerken met Relevance');
    }

    const data = await response.json();
    return data.output || 'Geen output beschikbaar';
  } catch (error) {
    console.error('Relevance API Error:', error);
    throw new Error('Fout bij het verwerken van LinkedIn profiel met Relevance');
  }
};