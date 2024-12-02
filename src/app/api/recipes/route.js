import axios from "axios";

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const recipe = searchParams.get("recipe")
    const diet = searchParams.get('diet')
    const type = searchParams.get('mealType')
    const cuisine = searchParams.get('cuisine')
    const maxReadyTime = searchParams.get('maxReadyTime')
    const number = 100
    const API_KEY = process.env.SPOONACULAR_API_KEY

    if (!recipe) {
        return new Response(JSON.stringify({ error: "recipe name required." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const res = await axios.get( 
            `https://api.spoonacular.com/recipes/complexSearch`, 
            {
                params : {
                    recipe,
                    diet,
                    type,
                    cuisine,
                    maxReadyTime,
                    number,
                    instructionsRequired : true,
                    apiKey : API_KEY
                }
            }
        )

        return new Response(JSON.stringify(res.data), {
            status: 200,
            headers : { "Content-Type": "application/json"}
        })

    } catch (error) {
        console.error("Error fetching recipes:", error.response?.data || error.message);
        return new Response(
            JSON.stringify({error: "Failed to fetch recipes. Please try again later."}),
            { status: 500, headers: { "Content-Type": "application/json" } }
        )
    }
}