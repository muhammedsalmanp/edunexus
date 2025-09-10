import * as bcrypt from 'bcrypt';

export class Password {
    private constructor (public readonly value: string){};

    static create (password:string):Password{
        if(password.length<6){
            throw new Error ('Password too short');
        }
        return new Password(password);
    }

     matches(input: string): boolean {
        return bcrypt.compareSync(input, this.value);
    }

    get Value(): string {
        return this.value;
    }
    
}