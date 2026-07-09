import config from "../../config";
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
    throw new Error("Rental already paid");
  }

  const payment = await prisma.payment.create({
    data: {
      rentalOrderId: rental.id,

      amount: rental.totalAmount,

      paymentProvider: "STRIPE",
    },
  });

  ///create session
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
  };
};

export const paymentService = {
  createCheckoutSession,
};
