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
        return(users);
    }

}
