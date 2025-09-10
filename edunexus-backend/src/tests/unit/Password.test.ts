import { PassWord } from '../../domain/valueObjects/Password';

describe('Password Value Object', () => {
  it('should create a valid password', () => {
    const password = PassWord.create('password123');
    expect(password.value).toBe('password123');
  });

  it('should throw an error for short password', () => {
    expect(() => PassWord.create('short')).toThrow('Password too short');
  });
});