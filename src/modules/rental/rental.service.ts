import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { TCreateRental } from "./rental.interface";

const createRentalOrder = async (
  payload: TCreateRental,
  customerId: string,
) => {
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (startDate >= endDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End date must be after start date",
    );
  }

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const gearIds = payload.items.map((item) => item.gearId);

  const gears = await prisma.gear.findMany({
    where: {
      id: {
        in: gearIds,
      },
    },
  });

  if (gears.length !== payload.items.length) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "One or more gear items not found",
    );
  }

  // Stock validation
  for (const item of payload.items) {
    const gear = gears.find((g) => g.id === item.gearId);

    if (!gear) continue;

    if (gear.stock < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `${gear.title} does not have enough stock`,
      );
    }
  }

  // Ensure all gears belong to one provider
  const providerIds = [...new Set(gears.map((g) => g.providerId))];

  if (providerIds.length > 1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only rent gear from one provider in a single order",
    );
  }

  const providerId = providerIds[0]!;
  // Calculate total amount
  let totalAmount = 0;

  for (const item of payload.items) {
    const gear = gears.find((g) => g.id === item.gearId)!;

    totalAmount += gear.pricePerDay * item.quantity * totalDays;
  }

  const result = await prisma.$transaction(async (tx) => {
    const rentalOrder = await tx.rentalOrder.create({
      data: {
        customerId,
        providerId,
        startDate,
        endDate,
        totalAmount,
      },
    });

    await tx.rentalItem.createMany({
      data: payload.items.map((item) => {
        const gear = gears.find((g) => g.id === item.gearId)!;

        return {
          rentalOrderId: rentalOrder.id,
          gearId: gear.id,
          quantity: item.quantity,
          pricePerDay: gear.pricePerDay,
        };
      }),
    });

    // // Optional: decrease stock immediately
    // // If you want to reserve stock after order creation
    // for (const item of payload.items) {
    //   await tx.gear.update({
    //     where: {
    //       id: item.gearId,
    //     },
    //     data: {
    //       stock: {
    //         decrement: item.quantity,
    //       },
    //     },
    //   });
    // }

    return tx.rentalOrder.findUnique({
      where: {
        id: rentalOrder.id,
      },
      include: {
        rentalItems: {
          include: {
            gear: true,
          },
        },
        customer: {
          omit: {
            password: true,
          },
        },
        provider: {
          omit: {
            password: true,
          },
        },
      },
    });
  });

  return result;
};

const getMyRentals = async (customerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    include: {
      rentalItems: {
        include: {
          gear: true,
        },
      },
      provider: {
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

const getSingleRental = async (rentalId: string, customerId: string) => {
  return prisma.rentalOrder.findFirstOrThrow({
    where: {
      id: rentalId,
      customerId,
    },
    include: {
      rentalItems: {
        include: {
          gear: true,
        },
      },
      provider: {
        omit: {
          password: true,
        },
      },
      payment: true,
    },
  });
};
export const rentalService = {
  createRentalOrder,
  getMyRentals,
  getSingleRental,
};
