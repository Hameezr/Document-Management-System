import express, { Express } from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import documentRouter from "./web/routes/documentRouter";
import metadataRouter from "./web/routes/metadataRouter";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;


app.use("/docs", documentRouter);
app.use("/metadata", metadataRouter);

app.use(bodyParser.json());

app.use("/", (req, res) => {
  res.send('wront route, sir')
});

async function ensureDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

ensureDatabaseConnection();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
