import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import {
  TCategoryQuery,
  TCreateCategory,
  TUpdateCategory,
} from "./category.interface";

const createCategory = async (payload: TCreateCategory) => {
  const { name } = payload;

  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getCategoriesFromDb = async (query: TCategoryQuery) => {
  const searchTerm = query.searchTerm;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 5;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const skip = (page - 1) * limit;

  const where = searchTerm
    ? {
        name: {
          contains: searchTerm,
          mode: "insensitive" as const,
        },
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.category.count({ where }),
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

const getSingleCategory = async (id: string) => {
  return prisma.category.findUniqueOrThrow({
    where: {
      id,
    },
  });
};
const updateCategory = async (id: string, payload: TUpdateCategory) => {
  if (payload.name) {
    const existing = await prisma.category.findFirst({
      where: {
        name: payload.name,
        NOT: {
          id,
        },
      },
    });

    if (existing) {
      throw new AppError(httpStatus.CONFLICT, "Category already exists");
    }
  }

  return prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  await prisma.category.delete({
    where: {
      id,
    },
  });

  return null;
};

export const categoryService = {
  createCategory,
  getCategoriesFromDb,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
