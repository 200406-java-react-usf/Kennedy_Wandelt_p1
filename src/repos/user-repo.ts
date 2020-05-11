import { User } from '../models/user';
import { CrudRepository } from './crud-repo';



export class UserRepo implements CrudRepository<User> {
    getAll(): Promise<User[]>{

    }
    getById(id: number): Promise<User>{

    }
    save(newUser: User): Promise<User>{

    }
    deleteById(id: number): Promise<boolean>{

    }
}