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

export const jwtService = new JwtService();
