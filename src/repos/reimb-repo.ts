import { Reimbursement } from '../models/reimb';
import { CrudRepository } from './crud-repo';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { InternalServerError} from '../error/error';



export class ReimbRepo implements CrudRepository<Reimbursement> {
    
    
    /**
     * Gets all reimbursements from ers_reimbursements table of database
     */
    async getAll(): Promise<Reimbursement[]>{
        let client: PoolClient;
        try{
            client = await connectionPool.connect();
            let sql = 'select * from ers_reimbursements';
            let rs = await client.query(sql);

            return rs.rows;
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getAll() in ReimbRepo.');
        }
    }


    /**
     * Get a single Reimbursement by Id value from ers_reimbursement table
     * @param id - number value referencing a Reimbursement Id
     */
    async getById(id: number): Promise<Reimbursement>{
        try{
            let client: PoolClient;
            client = await connectionPool.connect();
            let sql = 'select * from ers_reimbursements where reimb_id = $1'
            let rs = await client.query(sql, [id]);

            return rs.rows[0];
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getById method in ReimbRepo.');
        }
    }


    /**
     * Add new Reimbursement to ers_reimbursements table of data base
     * @param newReimb - Reimbursement object to be added to the DB
     */
    async save(newReimb: Reimbursement): Promise<Reimbursement>{
        try {
            let client: PoolClient;
            client = await connectionPool.connect();
            let sql = 'insert into ers_reimbursements(amount, submitted, description, author, resolver, status, type) values ($1, $2, $3, $4, $5, $6, $7)';
            let rs = await client.query(sql, [newReimb.amount, newReimb.submitted, newReimb.description, newReimb.author, newReimb.resolver, newReimb.status, newReimb.type]);

            return rs.rows[0];
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during save method in ReimbRepo.');
        }
    }


    /**
     * Delete Reimbursement from ers_reimbursements table of data base
     * @param id - id of reimbursement to be deleted
     */
    async deleteById(id: number): Promise<boolean>{
        try {
            let client: PoolClient;
            client = await connectionPool.connect();
            let sql = 'delete from ers_reimbursement where reimb_id = $1';
            let rs = await client.query(sql, [id]);

            return true;
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during deleteById method in ReimbRepo');
        }
    }  

    async getReimbByUserId(uId: number): Promise<Reimbursement[]>{
        try {
            let client: PoolClient;
            client = await connectionPool.connect();
            let sql = '';
            let rs = await client.query(sql, [uId]);

            return rs.rows;

        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getReimbByUserId method in ReimbRepo');
        }
    }

    async updateById(reimb: Reimbursement): Promise<Reimbursement> {
        try {
            let client: PoolClient;
            client = await connectionPool.connect();
            let sql = 'update ers_reimbursements set amount = $1, description = $2, reimb_type_id = $3';
            let rs = await client.query(sql, [reimb.amount, reimb.description, +reimb.type]);

            return rs.rows[0];
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getReimbByUserId method in ReimbRepo');
        }
    }


}