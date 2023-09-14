import express, { Express } from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import documentRouter from "./web/routes/documentRouter";
import authRouter from "./web/routes/authRouter";
import userRouter from "./web/routes/userRouter";
import ruleRouter from "./web/routes/RuleRouter";
import { errorsInterceptorMiddleware } from './web/utils/errors.interceptor';
import container from "./infrastructure/DIContainer";
import TYPES from "./infrastructure/DIContainer/types";
import { ILogger } from "./domain/shared/interfaces/ILogger";

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

const logger = container.get<ILogger>(TYPES.Logger);

app.use(bodyParser.json());
app.use("/document", documentRouter);
app.use('/auth', authRouter);
app.use("/user", userRouter);
app.use("/metadata", ruleRouter);

app.use("/", (req, res) => {
  res.send('wront route, sir')
});
app.use(errorsInterceptorMiddleware(logger));

if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET is not set.');
  process.exit(1);
}

app.listen(port, () => {
  logger.setContext('Server');
  logger.info('Server started...');
});
