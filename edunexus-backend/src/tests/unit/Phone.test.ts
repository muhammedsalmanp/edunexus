import { Phone } from '../../domain/valueObjects/Phone';

describe('Phone Value Object', () => {
  it('should create a valid phone number', () => {
    const phone = Phone.create('1234567890');
    expect(phone.value).toBe('1234567890');
  });

  it('should throw an error for invalid phone number', () => {
    expect(() => Phone.create('123')).toThrow('Phone number must be 10 digits');
    expect(() => Phone.create('123456789012')).toThrow('Phone number must be 10 digits');
  });
});