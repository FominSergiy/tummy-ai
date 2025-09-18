import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

class JwtService {
  /**
   * Generate a JWT token for authenticated user
   */
  generateToken(payload: {
    userId: number;
    email: string;
    timestamp: EpochTimeStamp;
  }) {
    try {
      if (JWT_SECRET)
        return jwt.sign(payload, JWT_SECRET, {
          expiresIn: '2h', // Token expires in 2 hours
          issuer: 'tummy-ai', // Optional: your app identifier
        });
    } catch (error) {
      throw new Error(
        'Error generating token: ' + (error as { message: string })?.message
      );
    }
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string) {
    try {
      if (JWT_SECRET)
        return jwt.verify(token, JWT_SECRET, {
          issuer: 'tummy-ai', // Optional: your app identifier
        });
    } catch (error) {
      if (error instanceof Error)
        if (error.name === 'TokenExpiredError') {
          throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
          throw new Error('Invalid token');
        } else if (error.name === 'NotBeforeError') {
          throw new Error('Token not active yet');
        } else {
          throw new Error('Token verification failed: ' + error.message);
        }
    }
  }
}

// /**
//  * Middleware function for Express.js to protect routes
//  */
// function authenticateToken(req, res, next) {
//   // Get token from Authorization header
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

//   if (!token) {
//     return res.status(401).json({ error: 'Access token required' });
//   }

//   try {
//     const decoded = verifyToken(token);
//     req.user = decoded; // Attach user info to request object
//     next();
//   } catch (error) {
//     return res.status(403).json({ error: error.message });
//   }
// }

// /**
//  * Check if token is close to expiry (useful for refresh logic)
//  * @param {string} token - JWT token to check
//  * @param {number} thresholdMinutes - Minutes before expiry to trigger refresh (default: 15)
//  * @returns {boolean} True if token expires within threshold
//  */
// function isTokenCloseToExpiry(token, thresholdMinutes = 15) {
//   try {
//     const decoded = jwt.decode(token);
//     if (!decoded || !decoded.exp) return true;

//     const expiryTime = decoded.exp * 1000; // Convert to milliseconds
//     const currentTime = Date.now();
//     const thresholdTime = thresholdMinutes * 60 * 1000; // Convert to milliseconds

//     return expiryTime - currentTime < thresholdTime;
//   } catch (error) {
//     return true; // If we can't decode, assume it needs refresh
//   }
// }

export const jwtService = new JwtService();
