import axios from "axios";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const ingredients = searchParams.get("ingredients");  
    const number = 100;
    const API_KEY = process.env.SPOONACULAR_API_KEY;

    if (!ingredients) {
        return new Response(JSON.stringify({ error: "Ingredients are required." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const res = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
            params: {
                ingredients: ingredients,
                number,
                apiKey: API_KEY,
            },
        });

        return new Response(JSON.stringify(res.data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching recipes:", error.response?.data || error.message);
        return new Response(
            JSON.stringify({ error: "Failed to fetch recipes. Please try again later." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

