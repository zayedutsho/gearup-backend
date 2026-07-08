export type TCreateCategory = {
  name: string;
  description?: string;
};

export type TUpdateCategory = Partial<TCreateCategory>;
export type TCategoryQuery = {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
};
