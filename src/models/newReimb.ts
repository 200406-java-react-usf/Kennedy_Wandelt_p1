export class NewReimbursement {

    amount: number;
    submitted: Date | number;
    description: string;
    author_id: number;
    reimb_status_id: number;
    reimb_type_id: number;

    constructor (amount: number, submitted: Date | number, description: string, author_id: number, reimb_status_id: number, reimb_type_id: number){
        this.amount = amount;
        this.submitted = submitted;
        this.description = description;
        this.author_id = author_id;
        this.reimb_type_id = reimb_type_id;
        this.reimb_status_id = reimb_status_id;
    }
}