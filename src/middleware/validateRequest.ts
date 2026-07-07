import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errorDetails: error.issues,
        });
      }

      next(error);
    }
  };
};
