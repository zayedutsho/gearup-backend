import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getProviderOrders = async (providerId: string) => {
  return prisma.rentalOrder.findMany({
    where: {
      providerId,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      rentalItems: {
        include: {
          gear: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateRentalStatus = async (
  rentalId: string,
  providerId: string,
  status: RentalStatus,
) => {
  const rental = await prisma.rentalOrder.findFirstOrThrow({
    where: {
      id: rentalId,
      providerId,
    },
  });

  // Prevent invalid transitions
  if (rental.status === "RETURNED" || rental.status === "CANCELLED") {
    throw new Error("Rental can no longer be updated");
  }

  return prisma.rentalOrder.update({
    where: {
      id: rental.id,
    },
    data: {
      status,
    },
  });
};

export const providerService = {
  getProviderOrders,
  updateRentalStatus,
};
