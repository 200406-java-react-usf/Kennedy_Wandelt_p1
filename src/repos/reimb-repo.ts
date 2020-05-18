import { Reimbursement } from '../models/reimb';
import { CrudRepository } from './crud-repo';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { InternalServerError} from '../error/error';
import { NewReimbursement } from '../models/newReimb';



export class ReimbRepo implements CrudRepository<Reimbursement> {
    
    
    /**
     * Gets all reimbursements from ers_reimbursements table of database
     */
    async getAll(): Promise<Reimbursement[]>{
        let client: PoolClient;
        try{
            client = await connectionPool.connect();
            let sql = 'select * from reimbs';
            let rs = await client.query(sql);

            return rs.rows;
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getAll() in ReimbRepo.');
        } finally {
            client && client.release();
        }
    }


    /**
     * Get a single Reimbursement by Id value from ers_reimbursement table
     * @param id - number value referencing a Reimbursement Id
     */
    async getById(id: number): Promise<Reimbursement>{
        let client: PoolClient;
        try{

            client = await connectionPool.connect();
            let sql = 'select * from reimbs where reimb_id = $1'
            let rs = await client.query(sql, [id]);

            return rs.rows[0];
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getById method in ReimbRepo.');
        } finally {
            client && client.release();
        }
    }


    /**
     * Add new Reimbursement to ers_reimbursements table of data base
     * @param newReimb - Reimbursement object to be added to the DB
     */
    async save(newReimb: NewReimbursement): Promise<Reimbursement>{
        let client: PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = 'insert into ers_reimbursements(amount, submitted, description, author, resolver, status, type) values ($1, $2, $3, $4, $5, $6, $7)';
            let rs = await client.query(sql, [newReimb.amount, newReimb.submitted, newReimb.description, newReimb.author_id, newReimb.resolver_id, newReimb.reimb_status_id, newReimb.reimb_type_id]);

            return rs.rows[0];
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during save method in ReimbRepo.');
        } finally {
            client && client.release();
        }
    }


    /**
     * Delete Reimbursement from ers_reimbursements table of data base
     * @param id - id of reimbursement to be deleted
     */
    async deleteById(id: number): Promise<boolean>{
        let client: PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = 'delete from ers_reimbursement where reimb_id = $1';
            let rs = await client.query(sql, [id]);

            return true;
        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during deleteById method in ReimbRepo');
        } finally {
            client && client.release();
        }
    }  

    async getReimbByUserId(uId: number): Promise<Reimbursement[]>{
        let client: PoolClient;
        try {

            client = await connectionPool.connect();
            let sql = 'select * from reimbs where author_id = $1';
            let rs = await client.query(sql, [uId]);

            return rs.rows;

        } catch (e) {
            console.log(e);
            throw new InternalServerError('Error during getReimbByUserId method in ReimbRepo');
        } finally {
            client && client.release();
        }
    }

    async updateById(reimb: Reimbursement): Promise<Reimbursement> {
        let client: PoolClient;

        
        try {
            client = await connectionPool.connect();
            let sql = 'update ers_reimbursements set amount = $1, description = $2, reimb_type_id = $3, reimb_status_id = $4, resolver_id = $5, resolved = $6';
            let rs = await client.query(sql, [+reimb.amount, reimb.description, +reimb.reimb_type, +reimb.reimb_status, +reimb.resolver_id, reimb.resolved]); 

            return rs.rows[0];
        } catch (e) {
            throw new InternalServerError('Error during getReimbByUserId method in ReimbRepo');
        } finally {
            client && client.release();
        }
    }
}