import {User} from '../models/user';
import {NewUser} from '../models/newUser';
import {UserRepo} from '../repos/user-repo';
import {isEmptyObject,
        isValidObject,
        isValidString,
        isValidNumber} from '../util/validation';
import {ResourceNotFoundError,
        BadRequestError,
        DataPersistanceError} from '../error/error';

export class UserService {
    constructor(private userRepo: UserRepo) {
        this.userRepo = userRepo;
    }

    /**
     * called UserRepo to get all users from data base, validates that returned value is not empty
     */
    async getAllUsers(): Promise<User[]> {
        let users = await this.userRepo.getAll();

        if(users.length === 0){
            throw new ResourceNotFoundError('No users found.')
        }
        return users;
    }

    /**
     * calls UserRepo to get a user by provided id, ensures that an object was recieved
     * @param id - id by which user will be searched in data base
     */
    async getUserById(id: number): Promise<User> {
        
        let user = await this.userRepo.getById(id);

        if(isEmptyObject(user)) {
            throw new ResourceNotFoundError('A user could not be found given the input id.');
        }
        return user;
    }

    /**
     * calls UserTrpo to add a user to the data base, validates is valid object and no conflicts in email or username keys
     * @param newUser -new user object to be added to database
     */
    async addNewUser(newUser: NewUser): Promise<User> {

        if(!isValidObject(newUser)) {
            throw new BadRequestError('User object given was invalid.');
        }
        
        let conflict = {};

        conflict = await this.userRepo.getUserByUniqueKey('email', newUser.email);


        if(conflict != 0){
            throw new DataPersistanceError('A user with this email already exists.');
        }

        conflict = await this.userRepo.getUserByUniqueKey('username', newUser.username);

        if(conflict != 0){
            throw new DataPersistanceError('A user with this username already exists.');
        }

        let user = await this.userRepo.save(newUser);

        return user;
    }

    /**
     * calls UserRepo to delete a user by provided id, validates that id is a valid number
     * @param id - id of user to be deleted
     */
    async deleteUserById(id: number): Promise<boolean> {
        if(!isValidNumber(id)){
            throw new BadRequestError('Given input is not a valid number.');
        }
        let isDeleted = await this.userRepo.deleteById(id);

        return isDeleted;
    }

    /**
     * calls UserRepo to search database for a user with given username and password, validates that username and password are valid strings
     * @param username - username to be authenticated
     * @param password - password to be authenticated
     */
    async authUser(username: string, password: string): Promise<User>{
        let authUser: User;
        
        if(!isValidString(username) || !isValidString(password)){
            throw new BadRequestError('Given username and/or password are not valid strings.');
        }

        authUser = await this.userRepo.getUserByCreds(username, password);

        return (authUser);
    }

    /**
     * calls UserRepo to update the user obejct at the provided id with the provided user object, validates that object is valid
     * @param user -user object to update the current object at that ers_user_id
     */
    async updateUser(user: User): Promise<boolean>{
        
        if(!isValidObject(user)) {
            throw new BadRequestError('User object given was invalid.');
        }

        await this.userRepo.updateById(user);

        return true;
    }
}
