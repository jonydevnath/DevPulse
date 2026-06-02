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

export const issuesService = { 
    createIssueInDB,
 };
