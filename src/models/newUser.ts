export class NewUser {

    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    role_id: number;

    constructor (username: string, password: string, first_name: string, last_name: string, email: string, role_id: number){
        this.username = username;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.role_id = role_id; 
    }
}