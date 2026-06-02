import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRouter } from "./modules/auth/auth.route";

const app: Application = express();

// Default middleware
app.use(express.json());

// Register the routes
app.use("/api/auth", authRouter);

export default app;
