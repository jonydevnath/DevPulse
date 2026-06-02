import express, {
  type Application,
} from "express";
import { authRouter } from "./modules/auth/auth.route";
import { issuesRouter } from "./modules/issues/issues.route";

const app: Application = express();

// Default middleware
app.use(express.json());

// Register the routes
app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);

export default app;
