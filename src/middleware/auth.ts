import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../generated/prisma/enums";
import config from "../config";
import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt.utils";
declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        id: string;
        role: UserRole;
      };
    }
  }
}

export const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1] // ✅ split by space
        : req.headers.authorization;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Please log in to access this resource",
      );
    }

    const verifiedToken = jwtUtils.verifyToken(
      token, // ✅ use token, not accessToken
      config.jwt_access_secret,
    );

    if (!verifiedToken.success) {
      throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.message);
    }

    const { email, name, role, id } = verifiedToken.data as JwtPayload;

    // ✅ Role check
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden access");
    }

    // ✅ Query by unique field
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.status === "BLOCKED") {
      throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked");
    }

    // Attach user info to request
    req.user = { email, name, id, role };
    next();
  });
};
