export class Reimbursement {

    id: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    author: number;
    resolver: number;
    status: number;
    type: number;

    constructor (amount: number, submitted: Date, description: string, author: number, resolver: number, status: number, type: number){
        this.amount = amount;
        this.submitted = submitted;
        this.description = description;
        this.author = author;
        this.type = type;
        this.resolver = resolver;
        this.status = status;
    }
}