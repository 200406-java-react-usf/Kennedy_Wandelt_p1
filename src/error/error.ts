class ApplicationError {

    statusCode: number;
    message: string;
    reason: string;
    timestamp: Date;

    constructor(statusCode: number, rsn?: string) {
        this.statusCode = statusCode;
        this.message = 'An unexpected error ocurred.';
        this.timestamp = new Date();
        rsn ? (this.reason = rsn) : this.reason = 'Unspecified reason.';
    }

    setMessage(message:string) {
        this.message = message;
    }
}


class ResourceNotFoundError extends ApplicationError {

    constructor(reason?: string) {
        super(404, reason);
        super.setMessage('No data found.');
    }
}


class BadRequestError extends ApplicationError {

    constructor(reason?: string) {
        super(400, reason);
        super.setMessage('Invalid parameters provided');
    }
}


class DataPersistanceError extends ApplicationError {

    constructor(reason?: string) {
        super(409, reason);
        super.setMessage('Could not save Data');
    }
}

class InternalServerError extends ApplicationError {

    constructor(reason?: string) {
        super(500, reason);
        super.setMessage('An unexpected error ocurred');
    }
}

export {
    ResourceNotFoundError,
    BadRequestError,
    DataPersistanceError,
    InternalServerError
}