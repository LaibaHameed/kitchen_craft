import { verify } from "jsonwebtoken";

const jwtSecret = process.env.jwtSecret;

export async function verifyToken(req) {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = verify(token, jwtSecret);
        return decoded.user;
    } catch (error) {
        throw new Error("Invalid token");
    }
}