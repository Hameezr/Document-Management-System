import express, { Express } from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import documentRouter from "./web/routes/documentRouter";
import userRouter from "./web/routes/userRouter";
import { errorsInterceptorMiddleware } from './web/utils/errors.interceptor';

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use("/document", documentRouter);
app.use("/user", userRouter);
app.use("/", (req, res) => {
  res.send('wront route, sir')
});
app.use(errorsInterceptorMiddleware());

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set.');
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
 