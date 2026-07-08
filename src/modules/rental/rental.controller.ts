import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";

const createRentalOrder = catchAsync(async (req, res) => {
  const customerId = req.user!.id;

  const result = await rentalService.createRentalOrder(req.body, customerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental order created successfully",
    data: result,
  });
});

const getMyRentals = catchAsync(async (req, res) => {
  const result = await rentalService.getMyRentals(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental orders fetched successfully",
    data: result,
  });
});

const getSingleRental = catchAsync(async (req, res) => {
  const result = await rentalService.getSingleRental(
    req.params.id as string,
    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental order fetched successfully",
    data: result,
  });
});

export const rentalController = {
  createRentalOrder,
  getMyRentals,
  getSingleRental,
};
