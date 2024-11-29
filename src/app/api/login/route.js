import db from "@/lib/db"; 
import { User } from "@/models/User";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(req) {
    let success = false;

    try {
        await db.connect();

        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ success, error: "User not found. Try logging in with a different email." }), { status: 400 });
        }

        // Validate the password field (ensure it is set for the user)
        if (!user.password) {
            return new Response(JSON.stringify({ success, error: "Password is not set for this user." }), { status: 400 });
        }

        // Compare passwords using bcrypt
        const pwdCompare = await compare(password, user.password);

        if (!pwdCompare) {
            return new Response(JSON.stringify({ success, error: "Your password is incorrect." }), { status: 400 });
        }

        // Generate JWT token (add user info like email for easier decoding)
        const data = { user: { id: user._id, email: user.email } };

        // Create the JWT with an expiry time (e.g., 1 hour)
        const authToken = sign(data, process.env.jwtSecret);

        success = true;
        return new Response(JSON.stringify({ success, authToken }), { status: 200 });

    } catch (error) {
        console.error("Error:", error.message);
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    } finally {
        await db.disconnect();
        console.log("Database disconnected.");
    }
}
