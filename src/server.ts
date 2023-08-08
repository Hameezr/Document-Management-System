import express, { Express } from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import documentRouter from "./web/routes/documentRouter";
import metaDataRouter from "./web/routes/metaDataRouter"
// import userRouter from "./Routes/userRouter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use("/docs", documentRouter);
app.use("/metadata", metaDataRouter);
// app.use("/users", userRouter);

app.use("/", (req, res)=>{
  res.send('wront route, sir')
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
