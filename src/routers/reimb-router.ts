import express from 'express';
import AppConfig from '../config/app';

export const ReimbRouter = express.Router();

const ReimbService = AppConfig.reimbService;


ReimbRouter.get('', async (req, resp) => {
    console.log('GET REQUEST RECIEVED AT /reimbursements');
    try {
        let payload = await ReimbService.getAllReimbs();
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
})

ReimbRouter.get('/:id', async (req, resp) => {
    let id = +req.params.id;
    console.log('GET REQUEST RECIEVED AT /reimbursements/' + id);
    try {
        let payload = await ReimbService.getReimbById(id);
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);        
    }
})


ReimbRouter.post('', async (req, resp) => {
    console.log('POST REQUEST RECIEVED AT /reimbursements');
    console.log(req.body);
    try {
        let payload = await ReimbService.addNewReimb(req.body);
        resp.status(201).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
})

ReimbRouter.delete('', async (req, resp) => {
    console.log('DELETE REQUEST RECIEVED AT /reimbursements');
    console.log(req.body);
    try {
        let payload = await ReimbService.deleteReimbById(req.body);
        resp.status(204).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
})
