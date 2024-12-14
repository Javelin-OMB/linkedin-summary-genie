import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    console.log('Analyzing LinkedIn URL:', url);

    const RELEVANCE_API_KEY = Deno.env.get('RELEVANCE_API_KEY');
    const RELEVANCE_ENDPOINT = Deno.env.get('RELEVANCE_ENDPOINT');

    if (!RELEVANCE_API_KEY || !RELEVANCE_ENDPOINT) {
      console.error('Missing required environment variables');
      throw new Error('Missing required environment variables');
    }

    console.log('Making request to Relevance API...');
    
    const response = await fetch(RELEVANCE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': RELEVANCE_API_KEY
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
      console.error('Relevance API error:', response.status, errorText);
      throw new Error(`Relevance API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Relevance API response received:', data);

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in analyze-linkedin function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});