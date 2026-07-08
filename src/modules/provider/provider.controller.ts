import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { providerService } from "./provider.service";

const getProviderOrders = catchAsync(async (req, res) => {
  const result = await providerService.getProviderOrders(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders fetched successfully",
    data: result,
  });
});

const updateRentalStatus = catchAsync(async (req, res) => {
  const result = await providerService.updateRentalStatus(
    req.params.id as string,
    req.user!.id,
    req.body.status,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental status updated successfully",
    data: result,
  });
});

export const providerController = {
  getProviderOrders,
  updateRentalStatus,
};
