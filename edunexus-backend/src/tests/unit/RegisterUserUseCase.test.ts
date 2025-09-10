import { RegisterUserUseCase } from '../../app/useCase/user/RegisterUserUseCase';
import { UserEntity } from '../../domain/entities/UserEntity';
import { Email } from '../../domain/valueObjects/Email';
import { PassWord } from '../../domain/valueObjects/Password';
import { Phone } from '../../domain/valueObjects/Phone';

describe('RegisterUserUseCase', () => {
  const mockUser = new UserEntity(
    '123',
    'John Doe',
    Email.create('john@example.com'),
    PassWord.create('password123'),
    Phone.create('1234567890')
  );

  const mockRepository = {
    findByEmail: jest.fn(),
    save: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    const useCase = new RegisterUserUseCase(mockRepository);
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
    };

    const result = await useCase.execute(dto);
    expect(result).toBeInstanceOf(UserEntity);
    expect(result.id).toBeDefined();
    expect(result.name).toBe(dto.name);
    expect(result.email.value).toBe(dto.email);
    expect(result.phone.value).toBe(dto.phone);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(UserEntity));
  });

  it('should throw an error if user already exists', async () => {
    mockRepository.findByEmail.mockResolvedValue(mockUser);
    const useCase = new RegisterUserUseCase(mockRepository);
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
    };

    await expect(useCase.execute(dto)).rejects.toThrow('User with this email already exists');
  });

  it('should throw an error for invalid email', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    const useCase = new RegisterUserUseCase(mockRepository);
    const dto = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123',
      phone: '1234567890',
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Invalid email');
  });

  it('should throw an error for short password', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    const useCase = new RegisterUserUseCase(mockRepository);
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'short',
      phone: '1234567890',
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Password too short');
  });

  it('should throw an error for invalid phone number', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    const useCase = new RegisterUserUseCase(mockRepository);
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '123',
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Phone number must be 10 digits');
  });
});