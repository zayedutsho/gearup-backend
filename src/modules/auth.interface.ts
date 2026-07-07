export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "CUSTOMER" | "PROVIDER";
};

export interface LoginUserPayload {
  email: string;
  password: string;
}
