import httpStatus from "http-status";
import Stripe from "stripe";
import config from "../../config";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/strripe";

const createCheckoutSession = async (
  rentalOrderId: string,
  customerId: string,
) => {
  const rental = await prisma.rentalOrder.findFirstOrThrow({
    where: {
      id: rentalOrderId,
      customerId,
    },
  });

  if (rental.paymentStatus === "PAID") {
    throw new AppError(httpStatus.CONFLICT, "Rental already paid");
  }

  const payment = await prisma.payment.create({
    data: {
      rentalOrderId: rental.id,
      amount: rental.totalAmount,
      paymentProvider: "STRIPE",
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(rental.totalAmount * 100),
          product_data: {
            name: `Rental Order ${rental.id}`,
            description: "Gear Rental",
          },
        },
      },
    ],
    metadata: {
      rentalOrderId: rental.id,
      paymentId: payment.id,
    },
    success_url: `${config.app_url}/premium?success=true`,
    cancel_url: `${config.app_url}/payment?success=false`,
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret,
  );

  if (event.type !== "checkout.session.completed") {
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const paymentId = session.metadata?.paymentId;
  const rentalOrderId = session.metadata?.rentalOrderId;

  if (!paymentId || !rentalOrderId) return;

  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!payment || payment.status === "PAID") {
      return;
    }

    await tx.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: "PAID",
        transactionId: session.payment_intent?.toString(),
        paidAt: new Date(),
      },
    });

    await tx.rentalOrder.update({
      where: {
        id: rentalOrderId,
      },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
    });
  });
};

const confirmPayment = async (sessionId: string, customerId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session.metadata?.paymentId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid payment session");
  }

  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      id: session.metadata.paymentId,
    },
    include: {
      rentalOrder: true,
    },
  });

  if (payment.rentalOrder.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
  }

  if (payment.status !== "PAID") {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "PAID",
          transactionId: session.payment_intent?.toString(),
          paidAt: new Date(),
        },
      });

      await tx.rentalOrder.update({
        where: {
          id: payment.rentalOrderId,
        },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
        },
      });
    });
  }

  return prisma.payment.findUniqueOrThrow({
    where: {
      id: payment.id,
    },
    include: {
      rentalOrder: true,
    },
  });
};

const getMyPayments = async (customerId: string) => {
  return prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId,
      },
    },
    include: {
      rentalOrder: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPaymentDetails = async (paymentId: string, customerId: string) => {
  return prisma.payment.findFirstOrThrow({
    where: {
      id: paymentId,
      rentalOrder: {
        customerId,
      },
    },
    include: {
      rentalOrder: {
        include: {
          rentalItems: {
            include: {
              gear: true,
            },
          },
        },
      },
    },
  });
};

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
  confirmPayment,
  getMyPayments,
  getPaymentDetails,
};
