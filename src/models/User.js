import mongoose from "mongoose";

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
            type: Array,
            default: [], 
        },
    },
    { collection: "Users" }
)

export const User = mongoose.models?.User || mongoose.model('User', userSchema)
