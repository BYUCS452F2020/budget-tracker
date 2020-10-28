import { BaseCategory, Category } from '../models/category';
import { BaseExpense, Expense } from '../models/expense';
import { BaseIncome, Income } from '../models/income';
import { BaseUser, User } from '../models/user';

export interface Database {
  loginUser(email: string, passwd: string): Promise<User>;
  getUser(userId: number): Promise<User>;
  getCategories(userId: number): Promise<Category[]>;
  getCategory(categoryId: number): Promise<Category>;
  getExpenses(userId: number): Promise<Expense[]>;
  getIncomes(userId: number): Promise<Income[]>;

  addUser(newUser: BaseUser): Promise<User>;
  editUser(user: User): Promise<User>;
  deleteUser(userId: number): Promise<void>;

  addCategory(newCategory: BaseCategory): Promise<Category>;
  editCategory(category: Category): Promise<Category>;
  deleteCategory(categoryId: number): Promise<void>;

  addExpense(newExpense: BaseExpense): Promise<Expense>;
  editExpense(expense: Expense): Promise<Expense>;
  deleteExpense(expenseId: number): Promise<void>;

  addIncome(newIncome: BaseIncome): Promise<Income>;
  editIncome(income: Income): Promise<Income>;
  deleteIncome(incomeId: number): Promise<void>;
}
