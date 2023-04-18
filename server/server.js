import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectedDb from './database/conn.js';
import router from './router/route.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

/* middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = 8080;

/* HTTP GET Request */
app.get('/', (req, res) => {
  res.status(201).json('Home GET Request');
});

/* api routes */
app.use('/api', router);

/* start server only when we have valid connection */

const start = async () => {
  try {
    await connectedDb(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
