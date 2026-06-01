import { pool } from "../../DB";
import bcrypt from "bcrypt";
import type { IUser } from "./auth.interface";

const createUsrInDB = async (payloads: IUser) => {
  const { name, email, password, role } = payloads;
  const hashpasswrd = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
        INSERT INTO users(name, email, password, role) VALUES($1,$2,$3,COALESCE($4, 'contributor')) RETURNING *
    `,
    [name, email, hashpasswrd, role],
  );

  delete result.rows[0].password;

  return result;
};

export const authService = {
  createUsrInDB,
};
