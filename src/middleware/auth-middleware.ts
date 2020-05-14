import { Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from '../error/error';

const adminGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found, please login.'));
    } else if (req.session.principal.role === 'admin') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }
}