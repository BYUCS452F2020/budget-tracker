export type Expense = {
  expense_id: string;
  category_id: string;
  amount: number;
  expense_date: Date;
  summary: string | null;
};

export type CreateExpensePayload = Omit<Expense, 'expense_id' | 'category_id'>;
export type BaseExpense = Omit<Expense, 'expense_id'>;
