import bcrypt from "bcryptjs";
import config from "../config";
import { prisma } from "../lib/prisma";
import { TRegisterUser } from "./auth.interface";

const createUserIntoDb = async (payload: TRegisterUser) => {
  const { name, email, password, phone, role } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    },
  });

  const { password: _, ...userWithoutPassword } = createdUser;

  return userWithoutPassword;
};
export const authServices = {
  createUserIntoDb,
};
