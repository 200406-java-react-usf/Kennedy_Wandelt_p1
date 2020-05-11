import express from 'express';

const app = express();

app.use('/', express.json());
app.get('/hello', (req, resp) => {
    resp.send('Hello World');
})

app.listen(5000, () => {
    console.log('Application running and listening at port 8080')
})

