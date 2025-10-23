import jwt from "jsonwebtoken"; // used for generating JWT tokens
// Middleware: ensures that a valid token is present in the Authorization header
export function authRequired(req, res, next) {
    try {
        const header = req.headers.authorization || ""; // get the Authorization header
        const token = header.startsWith("Bearer ") ? header.slice(7) : null; // remove "Bearer " prefix
        if (!token){
            return res.status(402).json({ error: "Authorization token missing" });}
            // if no token is provided reject the request
            const payload = jwt.verify(token, process.env.JWT_sECRET); // verify the token using the secret key 
            req.user = { id: payload.sub, username: payload.username }; // attach user info to request object
            next();
        } catch (err) {
            console.error("Auth error:", err.message);
            return res.status(401).json({error: "Invalid or expired token" })
        }   
    }