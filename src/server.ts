import express, { Express, Request, Response } from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import documentRouter from "./web/routes/documentRouter";
import metadataRouter from "./web/routes/metadataRouter";
// import userRouter from "./Routes/userRouter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const mongoUri = "mongodb+srv://hameezrizwan:Nokia12.@cluster0.o4cyp3w.mongodb.net/?retryWrites=true&w=majority"

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   }
// });

// // Create a Mongoose model
// const User = mongoose.model('User', userSchema);

mongoose.connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.error("Error connecting to MongoDB", error);
  });

// app.get('/test-save', async (req: Request, res: Response) => {
//   try {
//     const user = new User({ name: 'John Doe' }); // Saving a user with the name "John Doe"
//     await user.save();
//     res.send('User saved successfully!');
//   } catch (error) {
//     console.error('Failed to save user:', error);
//     res.status(500).send('Failed to save user.');
//   }
// });

app.use(bodyParser.json());

app.use("/docs", documentRouter);
app.use("/metadata", metadataRouter);
// app.use("/users", userRouter);

app.use("/", (req, res) => {
  res.send('wront route, sir')
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
