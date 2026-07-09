import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { TCreateReview } from "./review.interface";

const createReview = async (payload: TCreateReview, customerId: string) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      customerId,
      status: "RETURNED",
      rentalItems: {
        some: {
          gearId: payload.gearId,
        },
      },
    },
  });

  if (!rental) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only review gear after completing the rental",
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      customerId,
      gearId: payload.gearId,
    },
  });

  if (existingReview) {
    throw new AppError(httpStatus.CONFLICT, "You already reviewed this gear");
  }

  return prisma.review.create({
    data: {
      ...payload,
      customerId,
    },
  });
};

const getGearReviews = async (gearId: string) => {
  return prisma.review.findMany({
    where: {
      gearId,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const reviewService = {
  createReview,
  getGearReviews,
};
