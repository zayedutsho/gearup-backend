import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(async (req, res) => {
  const result = await paymentService.createCheckoutSession(
    req.body.rentalOrderId,

    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Checkout session created successfully",
    data: result,
  });
});

export const paymentController = {
  createCheckoutSession,
};
