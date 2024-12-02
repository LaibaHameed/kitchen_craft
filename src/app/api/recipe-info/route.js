import axios from "axios";

const API_KEY = process.env.SPOONACULAR_API_KEY;

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const recipeId = searchParams.get("recipeId"); // Get recipeId from query parameters

        if (!recipeId) {
            return new Response(JSON.stringify({ message: 'No recipe ID provided' }), { status: 400 });
        }

        console.log('Fetching details for recipeId:', recipeId);

        // Fetch recipe details from Spoonacular API
        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
            params: { apiKey: API_KEY },
        });

        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        // Handle specific errors (e.g., 404)
        if (error.response && error.response.status === 404) {
            console.log(`Recipe with ID ${recipeId} not found.`);
            return new Response(JSON.stringify({ message: 'Recipe not found' }), { status: 404 });
        }

        console.error('Error fetching recipe details:', error.message);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
