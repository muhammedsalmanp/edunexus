export class Phone {
  private constructor(public readonly value: string) {}

  static create(phone: string): Phone {
    const phonePattern = /^\+91\d{10}$/;

    if (!phonePattern.test(phone)) {
      throw new Error('Phone number must start with +91 followed by 10 digits');
    }

    return new Phone(phone);
  }
}
