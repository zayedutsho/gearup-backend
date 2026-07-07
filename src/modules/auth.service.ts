import bcrypt from "bcryptjs";
import config from "../config";
import { prisma } from "../lib/prisma";
import { LoginUserPayload, TRegisterUser } from "./auth.interface";

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

const loginUser = async (payload: LoginUserPayload) => {
  const { email, password } = payload;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email,
    },
  });

  if (user?.status === "BLOCKED") {
    throw new Error("ur account has been blocked");
  }

  return user;
};
export const authServices = {
  createUserIntoDb,
  loginUser,
  loginUser,
};
