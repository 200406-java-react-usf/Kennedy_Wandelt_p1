import express from 'express';
import AppConfig from '../config/app';
import { User } from '../models/user';
import { adminGuard } from '../middleware/auth-middleware';

export const UserRouter = express.Router();

const UserService = AppConfig.userService;


UserRouter.get('', async (req, resp) => {
    console.log('GET REQUEST RECIEVED AT /users');
    try {
        let payload = await UserService.getAllUsers();
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
})

UserRouter.get('/:id', async (req, resp) => {
    let id = +req.params.id;
    console.log('GET REQUEST RECIEVED AT /users/' + id);
    try {
        let payload = await UserService.getUserById(id);
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);        
    }
})


UserRouter.post('', adminGuard, async (req, resp) => {
    console.log('POST REQUEST RECIEVED AT /users');
    console.log(req.body as User);
    try {
        let payload = await UserService.addNewUser(req.body as User);
        resp.status(201).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
})

UserRouter.delete('', adminGuard, async (req, resp) => {
    console.log('DELETE REQUEST RECIEVED AT /users');
    console.log(req.body);
    try {
        let payload = await UserService.deleteUserById(req.body.id);
        resp.status(204).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
})
