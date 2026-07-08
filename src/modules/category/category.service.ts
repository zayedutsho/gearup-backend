import { prisma } from "../../lib/prisma";
import { TCreateCategory } from "./category.interface";

const createCategory = async (payload: TCreateCategory) => {
  const { name } = payload;

  const existingCategory = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

export const categoryService = {
  createCategory,
};
