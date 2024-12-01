import axios from "axios";

const API_KEY = process.env.SPOONACULAR_API_KEY;

export async function POST(req) {
    try {
        const { recipeIds } = await req.json(); 
        // const { searchParams } = new URL(req.url)
        // const recipeIds = searchParams.get("recipeIds")

        if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
            return new Response(JSON.stringify({ message: 'No recipe IDs provided' }), { status: 400 });
        }

        const recipeDetails = await Promise.all(
            recipeIds.map(async (recipeId) => {
                try {
                    console.log('Fetching details for recipeId:', recipeId);

                    const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
                        params: { apiKey: API_KEY }
                    });

                    return response.data; 
                } catch (err) {
                    if (err.response && err.response.status === 404) {
                        console.log(`Recipe with ID ${recipeId} not found.`);
                        return null; 
                    }

                    console.error('Error fetching recipe details:', err.message);
                    return null; 
                }
            })
        );

        // Filter out any null values if there were errors fetching some recipes
        const validRecipeDetails = recipeDetails.filter((recipe) => recipe !== null);

        return new Response(JSON.stringify({ recipes: validRecipeDetails }), { status: 200 });
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

