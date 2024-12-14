import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { linkedin_url } = await req.json()
    
    const RELEVANCE_API_KEY = Deno.env.get('RELEVANCE_API_KEY')
    const RELEVANCE_ENDPOINT = Deno.env.get('RELEVANCE_ENDPOINT')

    if (!RELEVANCE_API_KEY || !RELEVANCE_ENDPOINT) {
      throw new Error('Missing required environment variables')
    }

    const response = await fetch(RELEVANCE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': RELEVANCE_API_KEY
      },
      body: JSON.stringify({
        params: {
          linkedin_url
        },
        project: "d607c466-f207-4c47-907f-d928278273e2"
      })
    })

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})