import jwt from 'jsonwebtoken';

export class AuthService {
  generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  }
}
