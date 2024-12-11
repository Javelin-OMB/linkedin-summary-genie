const RELEVANCE_API_ENDPOINT = "https://api-d7b62b.stack.tryrelevance.com/latest/studios/cf5e9295-e250-4e58-accb-bafe535dd868/trigger_limited";

export const fetchLinkedInProfile = async (url: string) => {
  const apiKey = localStorage.getItem("RELEVANCE_API_KEY");
  
  if (!apiKey) {
    throw new Error("API key not found");
  }

  const response = await fetch(RELEVANCE_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url: url
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }

  return await response.json();
};