import { MongoUserRepository } from '../../infrastructure/repositories/UserRepository';
import { UserModel } from '../../infrastructure/database/models/UserModel';
import { UserEntity } from '../../domain/entities/UserEntity';
import { Email } from '../../domain/valueObjects/Email';
import { PassWord } from '../../domain/valueObjects/Password';
import { Phone } from '../../domain/valueObjects/Phone';
import * as bcrypt from 'bcrypt';

jest.mock('../../infrastructure/database/models/UserModel');
jest.mock('bcrypt');

describe('MongoUserRepository', () => {
  const mockUser = new UserEntity(
    '123',
    'John Doe',
    Email.create('john@example.com'),
    PassWord.create('password123'),
    Phone.create('1234567890')
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find user by email', async () => {
    const mockDoc = {
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
      phone: '1234567890',
      createdAt: new Date(),
    };
    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockDoc),
    });

    const repository = new MongoUserRepository();
    const result = await repository.findByEmail('john@example.com');

    expect(result).toBeInstanceOf(UserEntity);
    expect(result?.id).toBe(mockUser.id);
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
  });

  it('should return null if user not found', async () => {
    (UserModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const repository = new MongoUserRepository();
    const result = await repository.findByEmail('notfound@example.com');
    expect(result).toBeNull();
  });

  it('should save a user with hashed password', async () => {
    const mockSave = jest.fn().mockResolvedValue({});
    (UserModel as any).mockImplementation(() => ({ save: mockSave }));
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const repository = new MongoUserRepository();
    const result = await repository.save(mockUser);

    expect(result).toBe(mockUser);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password.value, 10);
    expect(mockSave).toHaveBeenCalled();
  });
});