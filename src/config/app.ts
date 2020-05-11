import {UserRepo} from '../repos/user-repo';
import {UserService} from '../services/user-service';


const userRepo = new UserRepo();
const userService = new UserService(userRepo);


export default {
    userService
}