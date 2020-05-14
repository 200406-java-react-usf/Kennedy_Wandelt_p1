export class Reimbursement {

    id: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    author: number;
    resolver: number;
    status: string;
    type: string;

    constructor (amount: number, submitted: Date, description: string, author: number, resolver: number, status: string, type: string){
        this.amount = amount;
        this.submitted = submitted;
        this.description = description;
        this.author = author;
        this.type = type;
        this.resolver = resolver;
        this.status = status;
    }
}