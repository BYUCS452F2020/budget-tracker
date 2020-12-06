export type Category = {
  category_id: string;
  user_id: string;
  category_name: string;
  amount: number;
  monthly_default: number | null;
};

export type CreateCategoryPayload = Omit<Category, 'category_id' | 'user_id'>;
export type BaseCategory = Omit<Category, 'category_id'>;
