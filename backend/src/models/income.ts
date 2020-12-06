export type Income = {
  income_id: string;
  user_id: string;
  amount: number;
  income_date: Date;
  summary: string | null;
};

export type CreateIncomePayload = Omit<Income, 'user_id' | 'income_id'>;
export type BaseIncome = Omit<Income, 'income_id'>;
