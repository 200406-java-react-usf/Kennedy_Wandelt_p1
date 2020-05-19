import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { InternalServerError} from '../error/error';
import { NewUser} from '../models/newUser';




export class UserRepo implements CrudRepository<User> {
    
    /**
     * Gets all users from ers_users table of database
     */
    async getAll(): Promise<User[]>{
        let client: PoolClient;
        try{
            client = await connectionPool.connect();
            let sql = 'select * from users';
            let rs = await client.query(sql);

            return rs.rows;
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getAll() in UserRepo.');
        } finally {
            client && client.release();
        }
    }


    /**
     * Get a single User by Id value from ers_users table
     * @param id - number value referencing a User Id
     */
    async getById(id: number): Promise<User>{
        let client: PoolClient;
        try{

            client = await connectionPool.connect();
            let sql = `select * from users where ers_user_id = $1`
            let rs = await client.query(sql, [id]);

            return rs.rows[0];
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getById method in UserRepo.');
        } finally {
            client && client.release();
        }
    }


    /**
     * Add new User to ers_users table of data base
     * @param newUser - User object to be added to the DB
     */
    async save(newUser: NewUser): Promise<User>{
        let client: PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = 'insert into ers_users(username, password, first_name, last_name, email, user_role_id) values ($1, $2, $3, $4, $5, $6)';
            let rs = await client.query(sql, [newUser.username, newUser.password, newUser.first_name, newUser.last_name, newUser.email, newUser.role_id]);
            let sql2 = 'select * from users where username = $1';
            let rs2 = await client.query(sql2, [newUser.username]);

            return rs2.rows[0];
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during save method in UserRepo.');
        } finally {
            client && client.release();
        }
    }


    /**
     * Delete User from ers_users table of data base
     * @param id - id of user to be deleted
     */
    async deleteById(id: number): Promise<boolean>{
        let client: PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = 'delete from ers_users where ers_user_id = $1';
            let rs = await client.query(sql, [id]);

            return true;
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during deleteById method in UserRepo');
        } finally {
            client && client.release();
        }
    }

    async getUserByCreds(un: string, pass: string): Promise<User> {
        let client: PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = `select * from users where username = $1 and password = $2`;
            let rs = await client.query(sql, [un, pass]);
            console.log(rs.rows[0] as User);
            return rs.rows[0];
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getUserByCreds method in UserRepo');
        } finally {
            client && client.release();
        }
    }

    async getUserByUniqueKey(key: string, value: string): Promise<number> {
        let client: PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = `select * from users where $1 = $2`;
            let rs = await client.query(sql, [key, value]);

            return rs.rows.length;
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getUserByUniqueKey in UserRepo');
        } finally {
            client && client.release();
        }
    }

    async updateById(user: User): Promise<User> {
        let client: PoolClient;

        try { 
            client = await connectionPool.connect();
            let sql = 'update ers_users set password = $1, first_name = $2, last_name = $3, user_role_id = $4, username = $5, email = $6 where ers_user_id = $7';
            let rs = await client.query(sql, [user.password, user.first_name, user.last_name, +user.role_name, user.username, user.email, +user.ers_user_id ]);

            return rs.rows[0];
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getReimbByUserId method in ReimbRepo');
        } finally {
            client && client.release();
        }
    }

    async 
}