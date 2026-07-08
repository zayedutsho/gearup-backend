import { RentalStatus } from "../../../generated/prisma/enums";

export type TUpdateRentalStatus = {
  status: RentalStatus;
};
