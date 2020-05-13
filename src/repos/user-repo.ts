import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { InternalServerError} from '../error/error';



export class UserRepo implements CrudRepository<User> {
    
    
    /**
     * Gets all users from ers_users table of database
     */
    async getAll(): Promise<User[]>{
        let client: PoolClient;
        try{
            client = await connectionPool.connect();
            let sql = 'select * from ers_users';
            let rs = await client.query(sql);

            return rs.rows;
        } catch (e) {
            throw new InternalServerError('Error during getAll() in UserRepo.');
        }
    }


    /**
     * Get a single User by Id value from ers_users table
     * @param id - number value referencing a User Id
     */
    async getById(id: number): Promise<User>{
        try{
            let client: PoolClient;
            client = await connectionPool.connect();
            let sql = 'select * from ers_users where ers_user_id = $1'
            let rs = await client.query(sql, [id]);

            return rs.rows[0];
        } catch (e) {
            throw new InternalServerError('Error during getById method in UserRepo.');
        }
    }


    /**
     * Add new User to ers_users table of data base
     * @param newUser - User object to be added to the DB
     */
    async save(newUser: User): Promise<User>{
        try {
            let client: PoolClient;
            client = await connectionPool.connect();
            let sql = 'insert into ers_users(username, password, first_name, last_name, email, user_role_id) values ($1, $2, $3, $4, $5, $6, $7)';
            let rs = await client.query(sql, [newUser.un, newUser.pass, newUser.fn, newUser.ln, newUser.email, newUser.role]);

            return rs.rows[0];
        } catch (e) {
            throw new InternalServerError('Error during save method in UserRepo.');
        }
    }


    /**
     * Delete User from ers_users table of data base
     * @param id - id of user to be deleted
     */
    async deleteById(id: number): Promise<boolean>{
        try {
            let client: PoolClient;
            client = await connectionPool.connect();
            let sql = 'delete from ers_users where ers_user_id = $1';
            let rs = await client.query(sql, [id]);

            return true;
        } catch (e) {
            throw new InternalServerError('Error during deleteById method in UserRepo');
        }
    }
    
}