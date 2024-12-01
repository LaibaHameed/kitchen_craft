import db from "@/lib/db";
import { PantryModel } from "@/models/Pantry";
import jwt, { verify } from "jsonwebtoken";

const jwtSecret = process.env.jwtSecret; 

// Helper to verify token
async function verifyToken(req) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    
    const decoded = verify(token, jwtSecret); 
    return decoded.user.email; 

  } catch (error) {
    throw new Error("Invalid token");
  }
}

// POST: Update Pantry
export async function POST(req) {
  try {
    await db.connect();
    const userEmail = await verifyToken(req); 
    const body = await req.json(); 
    const { pantry } = body;

    // Update or create the pantry for the user
    await PantryModel.findOneAndUpdate(
      { userId: userEmail }, 
      { ingredients: pantry },
      { upsert: true, new: true }
    );

    return new Response(JSON.stringify({ message: "Pantry updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating pantry:", error.message);
    return new Response(
      JSON.stringify({ message: error.message || "Error updating pantry" }),
      { status: 500 }
    );
  }
}

// GET: Fetch Pantry
export async function GET(req) {
  try {
    await db.connect();
    const userEmail = await verifyToken(req); 
    console.log(userEmail);

    const userPantry = await PantryModel.findOne({ userId: userEmail }); 

    return new Response(
      JSON.stringify({ pantry: userPantry?.ingredients || [] }), // Return ingredients or empty array if not found
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching pantry in route.js:", error.message);
    return new Response(
      JSON.stringify({ message: error.message || "Error fetching pantry" }),
      { status: 500 }
    );
  }
}
