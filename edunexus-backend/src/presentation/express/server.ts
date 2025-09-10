import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from '../../infrastructure/database/dbConfig';
import userRoutes from '../http/routes/userRoutes';
import adminRoutes from '../http/routes/adminRoutes';
import authRoute from '../http/routes/authRoutes';
import TeacherRoutes from '../http/routes/TeacherRoutes'

dotenv.config();

const app: Application = express();



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoute);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher',TeacherRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT ;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});