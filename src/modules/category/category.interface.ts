export type TCreateCategory = {
  name: string;
  description?: string;
};

export type TUpdateCategory = Partial<TCreateCategory>;
