import express from 'express';
import dotenv from 'dotenv';
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

const app = express();

app.use('/', express.json());
app.get('/hello', (req, resp) => {
    resp.send('Hello World');
})

app.listen(5000, () => {
    console.log('Application running and listening at port 8080')
})

