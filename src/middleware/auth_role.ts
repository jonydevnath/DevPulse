import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import type { ROLES } from "../types";
import { pool } from "../DB";
import sendResponse from "../utils/sendRes";
import type { TJwtPayload } from "../types/auth.types";
import { StatusCodes } from "http-status-codes";

const auth_role = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check if the token exist
      const token = req.headers.authorization;
      if (!token) {
        return sendResponse(res, {
          statusCode: StatusCodes.UNAUTHORIZED,
          success: false,
          message: "Unauthorized Access!",
        });
      }

      // verify the token
      const decode = jwt.verify(
        token as string,
        config.access_token_secret as string,
      ) as TJwtPayload;

      // find the user in the database if the the user is exist in the database
      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [decode.email],
      );

      const user = userData.rows[0];

      if (userData.rows.length === 0) {
        return sendResponse(res, {
          statusCode: StatusCodes.NOT_FOUND,
          success: false,
          message: "User not found!",
        });
      }

      if (roles.length && !roles.includes(user.role)) {
        return sendResponse(res, {
          statusCode: StatusCodes.FORBIDDEN,
          success: false,
          message: "Forbidden!",
        });
      }

      req.user = decode;

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth_role;
