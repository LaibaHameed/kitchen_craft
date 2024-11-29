import db from "@/lib/db";
import { User } from "@/models/User";
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(req) {
    let success = false;

    await db.connect();
    try {
        const { name, email, password } = await req.json();

        // Check if user already exists
        let findUser = await User.findOne({ email });

        if (!findUser) {
            // Hash the password before saving
            const hashPass = await hash(password, 10);

            // Create the user in the database
            const user = await User.create({
                name,
                email,
                password: hashPass
            });
            
            console.log('Generated user:', user);

            // Generate JWT token (add user info like email for easier decoding)
            const data = { user: { id: user._id , email: user.email } };

            // Create the JWT with an expiry time (e.g., 1 hour)
            console.log('JWT Secret:', process.env.jwtSecret);
            const authToken = sign(data, process.env.jwtSecret, { expiresIn: '1h' });  // Optional expiry

            success = true;

            // Send success response with the token
            return new Response(JSON.stringify({ success, authToken }), { status: 200 });
        } else {
            // If email is already registered
            return new Response(JSON.stringify({ success, error: "Account with this email already exists" }), { status: 400 });
        }
    } catch (error) {
        // If an error occurs, send the error message
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await db.disconnect();
    }
}
