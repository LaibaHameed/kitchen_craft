import db from "@/lib/db";
import { verify } from "jsonwebtoken";
import { User } from "@/models/User";  
import axios from "axios";

const jwtSecret = process.env.jwtSecret;
const API_KEY = process.env.SPOONACULAR_API_KEY;

async function verifyToken(req) {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        const decoded = verify(token, jwtSecret); 
        return decoded.user; 
    } catch (error) {
        throw new Error("Invalid token");
    }
}

// Handle the POST request for adding favorites
export async function POST(req) {
    const { recipeId } = await req.json(); 
    try {
        await db.connect();
        const user = await verifyToken(req); 
        const userId = await User.findOne({ email: user.email }).select('_id favourites'); 

        if (!userId) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Check if the recipe is already in the user's favorites array
        if (userId.favourites.includes(recipeId)) {
            return new Response(JSON.stringify({ message: 'Recipe is already in your favorites' }), { status: 400 });
        }

        // Add recipeId to the user's favourites array
        userId.favourites.push(recipeId);
        await userId.save();

        return new Response(JSON.stringify({ message: 'Recipe added to favorites successfully' }), { status: 201 });
    } catch (error) {
        console.error('Error adding recipe to favorites:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}


// Handle the GET request for fetching favorites
export async function GET(req) {
    try {
        // Verify user token and fetch their ID
        const user = await verifyToken(req); 
        const userId = await User.findOne({ email: user.email }).select('_id favourites'); 

        if (!userId) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Fetch the list of favorite recipe IDs from the user's `favourites` array
        const recipeIds = userId.favourites;

        if (recipeIds.length === 0) {
            return new Response(JSON.stringify({ message: 'No favorite recipes found' }), { status: 404 });
        }

        // Fetch recipe details for each recipeId from Spoonacular API
        const recipeDetails = await Promise.all(
            recipeIds.map(async (recipeId) => {
                const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
                    params: { apiKey: API_KEY }
                });
                return response.data; // Return full recipe details
            })
        );

        // Return the recipe details in the response
        return new Response(JSON.stringify({ favorites: recipeDetails }), { status: 200 });
    } catch (error) {
        console.error('Error fetching favorite recipes:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}