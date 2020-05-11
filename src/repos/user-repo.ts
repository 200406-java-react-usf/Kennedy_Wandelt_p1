import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import { PoolClient } from 'pg';
import { connectionPool } from '..';



export class UserRepo implements CrudRepository<User> {
    
    /**
     * Gets all users from data base
     */
    async getAll(): Promise<User[]>{
        let client: PoolClient;
        let sql = 'select * from ers_users';
        let rs = await client.query(sql);
        
        return rs.rows;
    }

    async getById(id: number): Promise<User>{
        let client: PoolClient;
        let sql = 'select * from ers_users where id = $1'
        let rs = await client.query(sql, [id]);

        return rs.rows[0];

    }

    save(newUser: User): Promise<User>{

    }

    deleteById(id: number): Promise<boolean>{

    }
}