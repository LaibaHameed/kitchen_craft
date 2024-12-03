import axios from "axios";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const API_KEY = process.env.SPOONACULAR_API_KEY
    
    if(!query){
        return new Response(
            JSON.stringify({ error: 'Query parameter is required.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const res = await axios.get(
            'https://api.spoonacular.com/recipes/autocomplete',
            {
                params: {
                    query,
                    number: 20, 
                    apiKey: API_KEY,
                },
            }
        )

        return new Response(JSON.stringify(res.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error fetching autocomplete data:', error.message);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch autocomplete data.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}