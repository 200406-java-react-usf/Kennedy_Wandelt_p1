export class User {

    id: number;
    un: string;
    pass: string;
    fn: string;
    ln: string;
    email: string;
    role: string;

    constructor (un: string, pass: string, fn: string, ln: string, email: string, role: string){
        this.un = un;
        this.pass = pass;
        this.fn = fn;
        this.ln = ln;
        this.email = email;
        this.role = role; 
    }
}