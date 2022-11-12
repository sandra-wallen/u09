import { config } from 'dotenv';
config();

import express from 'express';
import cookieParser from 'cookie-parser';
import listEndpoints from 'express-list-endpoints';

import { dbConnection } from './database/connection';
import router from "./routes/router";

const app = express();
const port = process.env.PORT;

const connectionString: string = `${process.env.MONGODB_CONNECTION_STRING}/${process.env.MONGODB_DB_NAME}`;

app.use(express.json());
app.use(cookieParser());
app.use("/", router);

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
});


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

dbConnection(connectionString);