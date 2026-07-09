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

const stripeWebhook = catchAsync(async (req, res) => {
  await paymentService.handleWebhook(
    req.body,
    req.headers["stripe-signature"] as string,
  );

  res.status(200).send();
});

const confirmPayment = catchAsync(async (req, res) => {
  const result = await paymentService.confirmPayment(
    req.body.sessionId,
    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment verified successfully",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req, res) => {
  const result = await paymentService.getMyPayments(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history fetched successfully",
    data: result,
  });
});

const getPaymentDetails = catchAsync(async (req, res) => {
  const result = await paymentService.getPaymentDetails(
    req.params.id as string,
    req.user!.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment fetched successfully",
    data: result,
  });
});
export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
  confirmPayment,
  getMyPayments,
  getPaymentDetails,
};
