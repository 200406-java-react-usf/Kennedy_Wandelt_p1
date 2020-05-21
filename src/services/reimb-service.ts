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

    async getAllReimbs(): Promise<Reimbursement[]> {
        let reimbs = await this.reimbRepo.getAll();

        if(reimbs.length === 0){
            throw new ResourceNotFoundError('No reimbursements found.')
        }
        return reimbs;
    }

    async getReimbById(id: number): Promise<Reimbursement> {
        if(!isValidNumber(+id)){
            throw new BadRequestError('Provided id is not a number');
        }

        let reimb = await this.reimbRepo.getById(id);

        if(isEmptyObject(reimb)){
            throw new ResourceNotFoundError('A reimbursement could not be found with the provided id');
        }
        return reimb;
    }

    async addNewReimb(newReimb: NewReimbursement): Promise<Reimbursement> {
        
        if(!isValidObject(newReimb)) {
            throw new BadRequestError('Reimbursement object provided is invalid or contains an invalid value')
        }
        
        let reimb = await this.reimbRepo.save(newReimb);

        return reimb;
    }


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