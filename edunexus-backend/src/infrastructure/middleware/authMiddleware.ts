import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/UserRepository';

const UserRepository = new userRepository();

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;