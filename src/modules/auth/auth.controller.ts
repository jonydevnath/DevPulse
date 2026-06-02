import type { Request, Response } from "express";
import sendResponse from "../../utils/sendRes";
import { authService } from "./auth.service";
import { StatusCodes } from "http-status-codes";

const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUsrInDB(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      errors: error.details || error.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserInDB(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      errors: error.details || error.message,
    });
  }
};

export const authController = {
  signupUser,
  loginUser,
};
