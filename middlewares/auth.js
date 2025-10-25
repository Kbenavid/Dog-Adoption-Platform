import jwt from 'jsonwebtoken';

// Ensures a valid Bearer token is provided
export function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';            // e.g. "Bearer <token>"
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' }); // ✅ 401
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET); // ✅ correct env var
    req.user = { id: payload.sub, username: payload.username }; // add user info to request
    return next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}