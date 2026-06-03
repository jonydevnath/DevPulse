import { pool } from "../../DB";
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

export const issuesService = {
  createIssueInDB,
  getAllIssuesFromDB,
};
