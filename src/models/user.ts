export class User {

    id: number;
    un: string;
    pass: string;
    fn: string;
    ln: string;
    email: string;
    role: number;

    constructor (id: number, username: string, password: string, fn: string, ln: string, email: string, role: number){
        this.id = id;
        this.un = username;
        this.pass = password;
        this.fn = fn;
        this.ln = ln;
        this.email = email;
        this.role = role; 
    }
}