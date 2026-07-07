import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { authServices } from "./auth.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await authServices.createUserIntoDb(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: {
        user,
      },
    });
  },
);

const logInUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await authServices.loginUser(payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User loggedIn successfully",
      data: {
        result,
      },
    });
  },
);
export const authController = {
  createUser,
  logInUser,
};
