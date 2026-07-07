import bcrypt from "bcryptjs";
import { SignOptions } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt.utils";
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

  const isPassWordMatched = await bcrypt.compare(password, user.password);

  if (!isPassWordMatched) {
    throw new Error("password is not matched");
  }

  if (user?.status === "BLOCKED") {
    throw new Error("ur account has been blocked");
  }

  const JwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  const accessToken = jwtUtils.createToken(
    JwtPayload,

    config.jwt_access_secret,

    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    JwtPayload,

    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};
export const authServices = {
  createUserIntoDb,
  loginUser,
};
