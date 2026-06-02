import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendRes";
import { issuesService } from "./issues.service";
import type { Request, Response } from "express";

const createIssue = async (req: Request, res: Response) => {

  try {
    const repoterId = req.user?.id as number;

    const result = await issuesService.createIssueInDB(req.body, repoterId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
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

export const issuesController = {
  createIssue,
};
