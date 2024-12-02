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
// Handle the POST request for adding favorites
export async function POST(req) {
    const { recipeId, title, image } = await req.json(); // Extract all fields
    try {
        await db.connect();
        const user = await verifyToken(req);
        const userRecord = await User.findOne({ email: user.email }).select('_id favourites');

        if (!userRecord) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        // Check if the recipe is already in the user's favorites array
        const alreadyExists = userRecord.favourites.some((fav) => fav.recipeId === recipeId);
        if (alreadyExists) {
            return new Response(JSON.stringify({ message: 'Recipe is already in your favorites' }), { status: 400 });
        }

        // Add the recipe details to the user's favourites array
        userRecord.favourites.push({ recipeId, title, image });
        await userRecord.save();

        return new Response(JSON.stringify({ message: 'Recipe added to favorites successfully' }), { status: 201 });
    } catch (error) {
        console.error('Error adding recipe to favorites:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

// Handle the GET request for fetching favorites
export async function GET(req) {
    try {
        await db.connect();
        const user = await verifyToken(req);
        const userRecord = await User.findOne({ email: user.email }).select('favourites');

        if (!userRecord) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        const favorites = userRecord.favourites; // Directly fetch from the database

        if (favorites.length === 0) {
            return new Response(JSON.stringify({ message: 'No favorite recipes found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ favorites }), { status: 200 });
    } catch (error) {
        console.error('Error fetching favorite recipes:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}
