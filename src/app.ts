import "reflect-metadata";
import express from 'express';
import routes from "./routes";
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { AppDataSource } from "./orm/dbCreateConnection";
import * as dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

(async () => {
  await AppDataSource();
})();