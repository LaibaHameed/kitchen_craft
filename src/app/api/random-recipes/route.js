import axios from "axios"

export async function GET() {
    const number = 30
    const API_KEY = process.env.SPOONACULAR_API_KEY

    try {
        const res = await axios('https://api.spoonacular.com/recipes/random',
            {
                params : {number, apiKey : API_KEY}
            }
        )

        return new Response(JSON.stringify(res.data), {status: 200, headers : { "Content-Type": "application/json"}})
    } catch (error) {
        console.error("Error fetching recipes:", error.response?.data || error.message);
        return new Response(
            JSON.stringify({error: "Failed to fetch random recipes. Please try again later."}),
            { status: 500, headers: { "Content-Type": "application/json" } }
        )
    }
}