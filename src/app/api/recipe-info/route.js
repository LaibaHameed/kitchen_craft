import axios from "axios";

const API_KEY = process.env.SPOONACULAR_API_KEY;

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const recipeId = searchParams.get("recipeId"); 

        if (!recipeId) {
            return new Response(JSON.stringify({ message: 'No recipe ID provided' }), { status: 400 });
        }

        console.log('Fetching details for recipeId:', recipeId);

        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
            params: { apiKey: API_KEY },
        });

        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`Recipe with ID ${recipeId} not found.`);
            return new Response(JSON.stringify({ message: 'Recipe not found' }), { status: 404 });
        }

        console.error('Error fetching recipe details:', error.message);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
