import { prisma } from "../../lib/prisma";
import { TCreateGear } from "./gear.interface";

const createGearIntoDB = async (payload: TCreateGear, providerId: string) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  return prisma.gear.create({
    data: {
      ...payload,
      providerId,
    },
  });
};

export const gearService = {
  createGearIntoDB,
};
