import { Router } from "express";
import { issuesController } from "./issues.controller";
import { USER_ROLE } from "../../types";
import auth_role from "../../middleware/auth_role";

const router = Router();

router.post("/", auth_role(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.createIssue);
router.get("/", issuesController.getAllIssues)

export const issuesRouter = router;
