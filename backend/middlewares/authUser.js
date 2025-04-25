import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {

  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data to the request object
    req.userId = decoded.id; // Attach the user ID to the request object
    
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authorization error:', error.message);
    return res.status(401).json({ message: 'Unauthorized access' });
  }
};

export default authUser;