// ============ BLOCK 1: IMPORTS ============

// Import jsonwebtoken to check (verify) login tokens
import jwt from 'jsonwebtoken';

// Import the User model so we can look up the user from the token's id
import User from '../models/userModel.js';


// ============ BLOCK 2: PROTECT MIDDLEWARE ============

// "protect" is a middleware: a function that runs BEFORE the route handler
// Used like: router.get('/profile', protect, handler)
// req = incoming request, res = response, next = "go to the next step"
export const protect = async (req, res, next) => {
  // Variable to hold the token (empty at first)
  let token;

  // Check if the Authorization header exists and starts with the word "Bearer"
  // The "?." avoids an error if the header is missing
  // Example header: "Authorization: Bearer eyJhbGciOi..."
  if (req.headers.authorization?.startsWith('Bearer')) {
    // 'try' runs the code; 'catch' handles a bad or expired token
    try {
      // Split the header at the space and take the second part (the token itself)
      // "Bearer abc123" -> ["Bearer", "abc123"] -> "abc123"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key from .env
      // If it is fake or expired, this throws an error and jumps to 'catch'
      // If valid, "decoded" holds the data inside it (e.g. { id: "..." })
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the id inside the token
      // .select('-password') means "do not include the password field"
      // Save the user on req.user so later code can use it
      req.user = await User.findById(decoded.id).select('-password');

      // Everything is fine: move on to the next middleware or route handler
      next();
    } catch (error) {
      // Token is invalid or expired: stop here with 401 (Unauthorized)
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  // If no token was found at all, stop with 401 (Unauthorized)
  if (!token) return res.status(401).json({ message: 'No token' });
};