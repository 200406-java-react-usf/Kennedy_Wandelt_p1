import {User} from '../models/user';
import {UserRepo} from '../repos/user-repo';
import {ResourceNotFoundError} from '../error/error';

export class UserService {
    constructor(private userRepo: UserRepo) {
        this.userRepo = userRepo;
    }

    async getAllUsers(): Promise<User[]> {
        let users = await this.userRepo.getAll();

        if(users.length === 0){
            throw new ResourceNotFoundError('No users found.')
        }
        return users;
    }

    async getUserById(id: number): Promise<User> {
        let user = await this.userRepo.getById(id);

        return user;
    }

    async addNewUser(newUser: User): Promise<User> {
        let user = await this.userRepo.save(newUser);

        return user;
    }

    async deleteUserById(id: number): Promise<boolean> {
        let isDeleted = await this.userRepo.deleteById(id);

        return isDeleted;
    }

    async authUser(username: string, password: string): Promise<User>{
        let authUser: User;
        
        authUser = await this.userRepo.getUserByCreds(username, password);

        return (authUser);
    
    }
}
