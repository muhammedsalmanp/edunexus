export class Email {
    private constructor(public readonly value: string) { };
    
    static create(email: string): Email {
      if(!email.includes('@')){
        throw new Error('Invalid email');
      }
      return new Email(email.toLowerCase());
    }
}