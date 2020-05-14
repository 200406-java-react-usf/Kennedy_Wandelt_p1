import {User} from '../models/user';
import {UserRepo} from '../repos/user-repo';
import {isEmptyObject,
        isValidObject,
        isValidString} from '../util/validation';
import {ResourceNotFoundError,
        BadRequestError,
        DataPersistanceError,
        InternalServerError} from '../error/error';

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

        if(isEmptyObject(user)) {
            throw new ResourceNotFoundError('A user could not be found given the input id.');
        }
        return user;
    }

    async addNewUser(newUser: User): Promise<User> {

        if(!isValidObject(newUser, 'id')) {
            throw new BadRequestError('User object given was invalid.');
        }
        
        let conflict = {};

        conflict = await this.userRepo.getUserByUniqueKey('email', newUser.email);

        if(!isEmptyObject(conflict)){
            throw new DataPersistanceError('A user with this email already exists.')
        }

        conflict = await this.userRepo.getUserByUniqueKey('username', newUser.un);

        if(!isEmptyObject(conflict)){
            throw new DataPersistanceError('A user with this username already exists.')
        }

        let user = await this.userRepo.save(newUser);

        return user;
    }

    async deleteUserById(id: number): Promise<boolean> {
        let isDeleted = await this.userRepo.deleteById(id);

        return isDeleted;
    }

    async authUser(username: string, password: string): Promise<User>{
        let authUser: User;
        
        if(!isValidString(username) || !isValidString(password)){
            throw new BadRequestError('Given username and/or password are not valid strings.');
        }

        authUser = await this.userRepo.getUserByCreds(username, password);

        return (authUser);
    }
}
