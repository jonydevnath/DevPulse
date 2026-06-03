import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendRes";
import { issuesService } from "./issues.service";
import type { Request, Response } from "express";

const createIssue = async (req: Request, res: Response) => {
  try {
    const repoterId = req.user?.id as number;

    const result = await issuesService.createIssueInDB(req.body, repoterId);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
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

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const sort = (req.query.sort as string) || "newest";

    const result = await issuesService.getAllIssuesFromDB(sort);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      data: result.rows,
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

const getSingleIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await issuesService.getSingleIssueFromDB(id as string);

    if (!result) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: "Issue Not Found!",
      });
    }

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      data: [result],
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      errors: error.details || error.message,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const loggedInUser = req.user;

  try {
    if (!loggedInUser) {
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: "Unauthorized Access!",
      });
    }

    const result = await issuesService.updateIssueInDB(
      payload,
      id as string,
      loggedInUser,
    );

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      errors: error.details || error.message,
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
};
