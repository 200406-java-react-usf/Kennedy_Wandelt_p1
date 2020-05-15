export class Principal {

    ers_user_id: number;
    username: string;
    role_name: string;

    constructor(ers_user_id: number, username: string, role_name: string) {
        this.ers_user_id = ers_user_id;
        this.username = username;
        this.role_name = role_name;
    }
    
}