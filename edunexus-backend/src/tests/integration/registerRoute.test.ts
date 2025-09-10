import request from 'supertest';
import express from 'express';
import userRoutes from '../../presentation/http/routes/userRoutes';
import { connectDB } from '../../infrastructure/database/dbConfig';
import { UserModel } from '../../infrastructure/database/models/UserModel';

jest.mock('../../infrastructure/database/dbConfig');
jest.mock('../../infrastructure/database/models/UserModel');

describe('Register Route', () => {
  let app: express.Application;

  beforeAll(async () => {
    (connectDB as jest.Mock).mockResolvedValue(undefined);
    app = express();
    app.use(express.json());
    app.use('/api', userRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    (UserModel as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    }));

    const response = await request(app)
      .post('/api/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe('John Doe');
    expect(response.body.data.email).toBe('john@example.com');
    expect(response.body.data.phone).toBe('1234567890');
  });

  it('should return 400 if user already exists', async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        phone: '1234567890',
        createdAt: new Date(),
      }),
    });

    const response = await request(app)
      .post('/api/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User with this email already exists');
  });

  it('should return 400 for invalid email', async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const response = await request(app)
      .post('/api/register')
      .send({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        phone: '1234567890',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email');
  });

  it('should return 400 for short password', async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const response = await request(app)
      .post('/api/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'short',
        phone: '1234567890',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password too short');
  });

  it('should return 400 for invalid phone number', async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const response = await request(app)
      .post('/api/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '123',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Phone number must be 10 digits');
  });
});