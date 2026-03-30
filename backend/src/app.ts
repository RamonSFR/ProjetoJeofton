import express from 'express';
import userRouter from './routes/user';
import restaurantRouter from './routes/restaurantRoutes';

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(restaurantRouter);

app.get('/test', (req, res) => {
    res.json({status : 'ok'});
});

export default app;