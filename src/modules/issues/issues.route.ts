import { Router } from "express";
import { issuesController } from "./issues.controller";
import { USER_ROLE } from "../../types";
import auth_role from "../../middleware/auth_role";

const router = Router();

router.post("/", auth_role(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.createIssue);
router.get("/", issuesController.getAllIssues)
router.get("/:id", issuesController.getSingleIssue)
router.patch("/:id", auth_role(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.updateIssue)
router.delete("/:id", auth_role(USER_ROLE.maintainer), issuesController.deleteIssue)

export const issuesRouter = router;
