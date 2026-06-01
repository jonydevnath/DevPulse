import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express()

// Default middleware
app.use(express.json());
app.use(express.text());
// app.use(cookieParser());


// Register the user routes

export default app;