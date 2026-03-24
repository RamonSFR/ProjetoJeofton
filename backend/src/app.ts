import express from "express";
import userRouter from './routes/user';

const app = express();
app.use(express.json());
app.use(userRouter);

app.get('/test', (req, res) => {
    res.json({status : 'ok'});
});

export default app;