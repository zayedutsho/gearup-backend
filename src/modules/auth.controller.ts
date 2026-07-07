import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../config";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt.utils";
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

    const { accessToken, refreshToken } = await authServices.loginUser(payload);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User loggedIn successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  },
);
const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    // console.log(req.user, "user request");

    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );

    if (typeof verifiedToken === "string") {
      throw new Error("Invalid token");
    }

    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const profile = await authServices.getMyProfileFromDB(userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User fetched successfully",
      data: {
        profile,
      },
    });
  },
);

export const authController = {
  createUser,
  logInUser,
  getMyProfile,
};
