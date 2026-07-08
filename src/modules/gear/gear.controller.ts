import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { gearService } from "./gear.service";

const createGear = catchAsync(async (req, res) => {
  const providerId = req.user!.id;

  const result = await gearService.createGearIntoDB(req.body, providerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Gear created successfully",
    data: result,
  });
});

const getAllGear = catchAsync(async (req, res) => {
  const result = await gearService.getAllGearFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleGear = catchAsync(async (req, res) => {
  const result = await gearService.getSingleGearFromDB(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear fetched successfully",
    data: result,
  });
});

const updateGear = catchAsync(async (req, res) => {
  const result = await gearService.updateGearIntoDB(
    req.params.id as string,
    req.body,
    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear updated successfully",
    data: result,
  });
});

const deleteGear = catchAsync(async (req, res) => {
  await gearService.deleteGearFromDB(req.params.id as string, req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gear deleted successfully",
    data: null,
  });
});

export const gearController = {
  createGear,
  getAllGear,
  getSingleGear,
  updateGear,
  deleteGear,
};
