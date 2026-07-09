import { prisma } from "../../lib/prisma";

const getUsers = async () => {
  return prisma.user.findMany({
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUser = async (id: string, payload: any) => {
  return prisma.user.update({
    where: {
      id,
    },
    data: payload,
    omit: {
      password: true,
    },
  });
};

const getRentals = async () => {
  return prisma.rentalOrder.findMany({
    include: {
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
      rentalItems: {
        include: {
          gear: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getGear = async () => {
  return prisma.gear.findMany({
    include: {
      category: true,
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

export const adminService = {
  getUsers,
  updateUser,
  getRentals,
  getGear,
};
