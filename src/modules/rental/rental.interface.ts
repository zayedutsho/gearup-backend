export type TRentalItemPayload = {
  gearId: string;
  quantity: number;
};

export type TCreateRental = {
  startDate: string;
  endDate: string;
  items: TRentalItemPayload[];
};
