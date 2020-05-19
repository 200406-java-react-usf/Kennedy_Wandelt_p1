import express, { response } from 'express';
import AppConfig from '../config/app';
import { User } from '../models/user';
import { adminGuard } from '../middleware/auth-middleware';
import {NewUser} from '../models/newUser';

export const UserRouter = express.Router();

const UserService = AppConfig.userService;


UserRouter.get('', adminGuard, async (req, resp) => {
    console.log('GET REQUEST RECIEVED AT /users');
    try {
        let payload = await UserService.getAllUsers();
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
})

UserRouter.get('/:id', adminGuard, async (req, resp) => {
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
        let payload = await UserService.addNewUser(req.body as NewUser);
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

UserRouter.put('', adminGuard, async (req, resp) => {
    console.log('PUT REQUEST RECIEVED AT /users');
    console.log(req.body);
    try {
        let payload = await UserService.updateUser(req.body);
        resp.status(204).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
})
