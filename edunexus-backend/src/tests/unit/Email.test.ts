import { Email } from '../../domain/valueObjects/Email';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = Email.create('john@example.com');
    expect(email.value).toBe('john@example.com');
  });

  it('should throw an error for invalid email', () => {
    expect(() => Email.create('invalid-email')).toThrow('Invalid email');
  });

  it('should convert email to lowercase', () => {
    const email = Email.create('JOHN@EXAMPLE.COM');
    expect(email.value).toBe('john@example.com');
  });
});