import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

const getUsers = catchAsync(async (req, res) => {
  const result = await adminService.getUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users fetched successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await adminService.updateUser(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const getRentals = catchAsync(async (req, res) => {
  const result = await adminService.getRentals();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rentals fetched successfully",
    data: result,
  });
});

const getGear = catchAsync(async (req, res) => {
  const result = await adminService.getGear();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear fetched successfully",
    data: result,
  });
});

export const adminController = {
  getUsers,
  updateUser,
  getRentals,
  getGear,
};
