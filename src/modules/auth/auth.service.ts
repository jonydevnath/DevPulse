import { pool } from "../../DB";
import bcrypt from "bcrypt";
import type { IUser } from "./auth.interface";
import config from "../../config";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

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

const loginUserInDB = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  // check if the user exists through email
  const userEmail = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );

  if (userEmail.rows.length === 0) {
    const error: any = new Error("Authentication failed");
    error.statusCode = StatusCodes.UNAUTHORIZED;
    error.details = "Invalid credentials";
    throw error;
  }

  const user = userEmail.rows[0];

  // compare the password
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    const error: any = new Error("Authentication failed");
    error.statusCode = StatusCodes.UNAUTHORIZED;
    error.details = "Invalid credentials";
    throw error;
  }

  // generate the JWT token
  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtpayload, config.access_token_secret as string, {
    expiresIn: config.access_token_expire as any,
  });

  delete user.password;

  return { token, user };
};

export const authService = {
  createUsrInDB,
  loginUserInDB,
};
