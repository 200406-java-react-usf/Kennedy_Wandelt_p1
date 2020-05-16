import {Reimbursement} from '../models/reimb';
import {ReimbRepo} from '../repos/reimb-repo';
import {ResourceNotFoundError} from '../error/error';
import {NewReimbursement} from '../models/newReimb';

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
        let reimb = await this.reimbRepo.getById(id);

        return reimb;
    }

    async addNewReimb(newReimb: NewReimbursement): Promise<Reimbursement> {
        let reimb = await this.reimbRepo.save(newReimb);

        return reimb;
    }

    async deleteReimbById(id: number): Promise<boolean> {
        let isDeleted = await this.reimbRepo.deleteById(id);

        return isDeleted;
    }

    async getReimbByUserId(userId: number): Promise<Reimbursement[]> {
        let myReimbs = await this.reimbRepo.getReimbByUserId(userId);

        return myReimbs;
    }
}