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
    console.log("in midill ware");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    const user = await UserRepository.findById(decoded.userId);

    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }
  
  
    req.user = user; 
      console.log("pass");
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;