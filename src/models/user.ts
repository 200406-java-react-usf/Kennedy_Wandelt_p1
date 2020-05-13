export class User {

    id: number;
    un: string;
    pass: string;
    fn: string;
    ln: string;
    email: string;
    role: string;

    constructor (id: number, username: string, password: string, fn: string, ln: string, email: string, role: string){
        this.id = id;
        this.un = username;
        this.pass = password;
        this.fn = fn;
        this.ln = ln;
        this.email = email;
        this.role = role; 
    }
}