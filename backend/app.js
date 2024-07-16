import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import user from './routes/user.js';
import complaint from './routes/complaint.js';
const router = express.Router();

const app = express();

dotenv.config({
    path: '.env',
});

//using middlewares 
app.use(express.json());
app.use(cookieParser());

//using routes
app.use('/api/v1', user);
app.use('/api/v1', complaint);




export default app;