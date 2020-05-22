import {Reimbursement} from '../models/reimb';
import {ReimbRepo} from '../repos/reimb-repo';
import {NewReimbursement} from '../models/newReimb';
import {ResourceNotFoundError,
        BadRequestError,
        DataPersistanceError} from '../error/error';
import { isEmptyObject, isValidObject, isValidNumber } from '../util/validation';

export class ReimbService {
    constructor(private reimbRepo: ReimbRepo) {
        this.reimbRepo = reimbRepo;
    }

    /**
     * calls ReimbRepo to get all REimbursements form the database, validates that the returned array is not empty
     */
    async getAllReimbs(): Promise<Reimbursement[]> {
        let reimbs = await this.reimbRepo.getAll();

        if(reimbs.length === 0){
            throw new ResourceNotFoundError('No reimbursements found.')
        }
        return reimbs;
    }


    /**
     * calls ReimbRepo to get a Reimbursement based on the provided id, validates that provied id is a valid number and that a non empty object is returned
     * @param id - id of targetted reimbursement
     */
    async getReimbById(id: number): Promise<Reimbursement> {
        if(!isValidNumber(id)){
            throw new BadRequestError('Provided id is not a number');
        }

        let reimb = await this.reimbRepo.getById(id);

        if(isEmptyObject(reimb)){
            throw new ResourceNotFoundError('A reimbursement could not be found with the provided id');
        }
        return reimb;
    }

    /**
     * calls ReimbRepo to add provided reimbursement to the database, validates that object and its values are valid
     * @param newReimb - reimbursement object to be added to database
     */
    async addNewReimb(newReimb: NewReimbursement): Promise<Reimbursement> {
        
        if(!isValidObject(newReimb)) {
            throw new BadRequestError('Reimbursement object provided is invalid or contains an invalid value')
        }
        
        let reimb = await this.reimbRepo.save(newReimb);

        return reimb;
    }


    /**
     * calls ReimbRepo to find reimbursements based on userId foreign key, validates that the provided id is a valid number and that array returned is not empty
     * @param userId - target user Id to get searched for related reimbursements
     */
    async getReimbByUserId(userId: number): Promise<Reimbursement[]> {

        if(!isValidNumber(userId)){
            throw new BadRequestError('Given input is not a valid number.');
        }

        let myReimbs = await this.reimbRepo.getReimbByUserId(userId);

        if(myReimbs.length === 0){
            throw new ResourceNotFoundError('No reimbursements found with provided author Id.');
        }

        return myReimbs;
    }

    /**
     * calls ReimbRepo to update the reimbursement at the provided id calie, validates that the values are correct numbers 
     * @param newReimb - reimbursement object to be updated at the provided id value
     */
    async updateReimb(newReimb: Reimbursement): Promise<boolean> {

        if(!isValidObject(newReimb, 'resolved', 'resolver_id')){
            throw new BadRequestError('Provided input is not a valid object, or contains invalid characteristics');
        }


        if(!isValidNumber(+newReimb.reimb_status) || !isValidNumber(+newReimb.reimb_type)){
            throw new DataPersistanceError('Reimbursemetn Status or Type are not valid numbers');
        }

        if(+newReimb.reimb_status > 3 || +newReimb.reimb_type > 4){
            throw new DataPersistanceError('Reimbursement Status or Type is not a valid id');
        }
        let reimb = await this.reimbRepo.updateById(newReimb);

        return true;
    }
}