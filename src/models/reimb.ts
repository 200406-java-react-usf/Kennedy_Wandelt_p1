export class Reimbursement {

    reimb_id: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    author_id: number;
    resolver_id: number;
    reimb_status: string;
    reimb_type: string;

    constructor (reimb_id: number, amount: number, submitted: Date, resolved: Date, description: string, author_id: number, resolver_id: number, reimb_status: string, reimb_type: string){
        this.amount = amount;
        this.submitted = submitted;
        this.description = description;
        this.author_id = author_id;
        this.reimb_type = reimb_type;
        this.resolver_id = resolver_id;
        this.reimb_status = reimb_status;
        this.reimb_id = reimb_id;
        this.resolved = resolved;
    }
}