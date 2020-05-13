import {UserRepo} from '../repos/user-repo';
import {UserService} from '../services/user-service';
import {ReimbRepo} from '../repos/reimb-repo';
import {ReimbService} from '../services/reimb-service';


const userRepo = new UserRepo();
const userService = new UserService(userRepo);

const reimbRepo = new ReimbRepo();
const reimbService = new ReimbService(reimbRepo);


export default {
    userService,
    reimbService
}