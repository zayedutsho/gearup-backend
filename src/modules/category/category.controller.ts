import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.createCategory(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully",
      data: result,
    });
  },
);

const getCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    console.log(query);
    const result = await categoryService.getCategoriesFromDb(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category Fetched successfully",
      data: result,
    });
  },
);

const getSingleCategory = catchAsync(async (req, res) => {
  const result = await categoryService.getSingleCategory(
    req.params.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const result = await categoryService.updateCategory(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: null,
  });
});

export const categoryController = {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
