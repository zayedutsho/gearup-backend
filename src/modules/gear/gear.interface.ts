export type TCreateGear = {
  title: string;
  description?: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
};

export type TUpdateGear = Partial<TCreateGear>;

export type TGearQuery = {
  searchTerm?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;

  page?: number;
  limit?: number;
  sortBy?: "pricePerDay" | "createdAt";
  sortOrder?: "asc" | "desc";
};
