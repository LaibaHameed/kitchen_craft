import mongoose from "mongoose";

// Define the schema for the favorite recipes
const favouriteSchema = new mongoose.Schema({
    recipeId: {
        type: String,
        required: [true, "Recipe ID is required"],
    },
    title: {
        type: String,
        required: [true, "Recipe title is required"],
    },
    image: {
        type: String,
        required: [true, "Recipe image is required"],
    },
});

// Define the schema for users
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter name"],
        },
        email: {
            type: String,
            required: [true, "Please enter email"],
            unique: true, 
        },
        password: {
            type: String,
            required: [true, "Please enter password"], 
        },
        favourites: {
            type: [favouriteSchema], 
            default: [], 
        },
    },
    { collection: "Users" }
);

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
