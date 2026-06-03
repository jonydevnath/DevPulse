import { StatusCodes } from "http-status-codes";
import { pool } from "../../DB";
import type { TJwtPayload } from "../../types/auth.types";
import type { Iissues } from "./issues.interface";

const createIssueInDB = async (payloads: Iissues, repoterId: number) => {
  const { title, description, type } = payloads;

  const result = await pool.query(
    `
    INSERT INTO issues(title, description, type, reporter_id) VALUES($1,$2,$3,$4) RETURNING *   
  `,
    [title, description, type, repoterId],
  );

  return result;
};

const getAllIssuesFromDB = async (sortOpt: string) => {
  // Handle sorting
  let orderByClause = "ORDER BY created_at DESC";
  if (sortOpt === "oldest") orderByClause = "ORDER BY created_at ASC";

  // Fetch all issues
  const issuesResult = await pool.query(
    `SELECT * FROM issues ${orderByClause};`,
  );
  if (issuesResult.rows.length === 0) return issuesResult;

  // Gather reporter IDs
  const reporterIds: number[] = [];
  for (const issue of issuesResult.rows) {
    reporterIds.push(issue.reporter_id);
  }

  // Batch fetch the users
  const usersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds],
  );

  // Combine the data
  for (const issue of issuesResult.rows) {
    // Find the matching user row
    let matchedUser = null;
    for (const user of usersResult.rows) {
      if (user.id === issue.reporter_id) {
        matchedUser = user;
        break;
      }
    }

    // Attach the nested object
    if (matchedUser) {
      issue.reporter = {
        id: matchedUser.id,
        name: matchedUser.name,
        role: matchedUser.role,
      };
    } else {
      issue.reporter = null;
    }

    // Remove the reporter_id
    delete issue.reporter_id;
  }

  return issuesResult;
};

const getSingleIssueFromDB = async (id: string) => {
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);

  if (issueResult.rows.length === 0) {
    return null;
  }

  const issue = issueResult.rows[0];

  const userResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );

  const matchedUser = userResult.rows[0];

  issue.reporter = matchedUser
    ? {
        id: matchedUser.id,
        name: matchedUser.name,
        role: matchedUser.role,
      }
    : null;

  delete issue.reporter_id;

  return issue;
};

const updateIssueInDB = async (
  payload: any,
  id: string,
  loggedInUser: TJwtPayload,
) => {
  const { title, description, type } = payload;

  const existingIssueResult = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id],
  );

  if (existingIssueResult.rows.length === 0) {
    const error: any = new Error("Issue Not Found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  const existingIssue = existingIssueResult.rows[0];

  // contributor Access Rules
  if (loggedInUser.role === "contributor") {
    if (existingIssue.reporter_id !== loggedInUser.id) {
      const error: any = new Error("Forbidden!");
      error.statusCode = StatusCodes.FORBIDDEN;
      error.details = "You can only update your own issues";
      throw error;
    }
    if (existingIssue.status !== "open") {
      const error: any = new Error("Forbidden!");
      error.statusCode = StatusCodes.FORBIDDEN;
      error.details = "You cannot update an issue that is no longer open";
      throw error;
    }
  }

  const result = await pool.query(
    `
    UPDATE issues 
    SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      updated_at = NOW()
    WHERE id = $4 
    RETURNING *
    `,
    [title, description, type, id],
  );

  return result.rows[0];
};

export const issuesService = {
  createIssueInDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
};
