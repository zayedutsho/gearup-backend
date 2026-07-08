import { Prisma } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import { TCreateGear, TGearQuery, TUpdateGear } from "./gear.interface";

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

const getAllGearFromDB = async (query: TGearQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const where: Prisma.GearWhereInput = {};

  if (query.searchTerm) {
    where.OR = [
      {
        title: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.brand) {
    where.brand = query.brand;
  }

  //   if (query.isAvailable !== undefined) {
  //     where.isAvailable = query.isAvailable === "true";
  //   }

  if (query.minPrice || query.maxPrice) {
    where.pricePerDay = {};

    if (query.minPrice) {
      where.pricePerDay.gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      where.pricePerDay.lte = Number(query.maxPrice);
    }
  }

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const [data, total] = await Promise.all([
    prisma.gear.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),

    prisma.gear.count({
      where,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getSingleGearFromDB = async (id: string) => {
  return prisma.gear.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });
};

const updateGearIntoDB = async (
  id: string,
  payload: TUpdateGear,
  providerId: string,
) => {
  const gear = await prisma.gear.findFirstOrThrow({
    where: {
      id,
      providerId,
    },
  });

  return prisma.gear.update({
    where: {
      id: gear.id,
    },
    data: payload,
  });
};

const deleteGearFromDB = async (id: string, providerId: string) => {
  const gear = await prisma.gear.findFirstOrThrow({
    where: {
      id,
      providerId,
    },
  });

  await prisma.gear.delete({
    where: {
      id: gear.id,
    },
  });

  return null;
};

export const gearService = {
  createGearIntoDB,
  getAllGearFromDB,
  getSingleGearFromDB,
  updateGearIntoDB,
  deleteGearFromDB,
};
