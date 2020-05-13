import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';

import { UserRouter } from './routers/user-router';
import { corsFilter } from './middleware/cors-filter';
import { ReimbRouter } from './routers/reimb-router';
import { AuthRouter } from './routers/auth-router';
import { sessionMiddleware } from './middleware/session';
import {Pool} from 'pg';
dotenv.config();

export const connectionPool: Pool =  new Pool({

    host: process.env['DB_HOST'],
    port: +process.env['DB_PORT'],
    database: process.env['DB_NAME'],
    user: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    max: 5

});

fs.mkdir(`${__dirname}/logs`, () => {});
const logStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });

const app = express();

app.use(morgan('combined', { stream: logStream }));
app.use(sessionMiddleware);
app.use(corsFilter);
app.use('/', express.json());
app.use('/users', UserRouter);
app.use('/reimbursements', ReimbRouter);
app.use('/auth', AuthRouter);

app.get('/hello', (req, resp) => {
    resp.send('Hello World');
})

app.listen(8080, () => {
    console.log('Application running and listening at port 8080')
})

