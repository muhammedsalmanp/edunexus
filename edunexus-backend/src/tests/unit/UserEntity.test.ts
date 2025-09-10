import { UserEntity } from '../../domain/entities/UserEntity';
import { Email } from '../../domain/valueObjects/Email';
import { PassWord } from '../../domain/valueObjects/Password';
import { Phone } from '../../domain/valueObjects/Phone';

describe('UserEntity', () => {
  it('should create a user entity with valid data', () => {
    const email = Email.create('john@example.com');
    const password = PassWord.create('password123');
    const phone = Phone.create('1234567890');
    const user = new UserEntity('123', 'John Doe', email, password, phone);
    
    expect(user.id).toBe('123');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe(email);
    expect(user.password).toBe(password);
    expect(user.phone).toBe(phone);
    expect(user.createdAt).toBeInstanceOf(Date);
  });
});