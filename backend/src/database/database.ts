import { BaseCategory, Category } from '../models/category';
import { BaseExpense, Expense } from '../models/expense';
import { BaseIncome, Income } from '../models/income';
import { BaseUser, User } from '../models/user';

export interface Database {
    init(): Promise<void>;

    loginUser(email: string, passwd: string): Promise<User>;
    getUser(userId: string): Promise<User>;
    getCategories(userId: string): Promise<Category[]>;
    getCategory(categoryId: string): Promise<Category>;
    getExpenses(userId: string): Promise<Expense[]>;
    getCategoryExpenses(categoryId: string): Promise<Expense[]>;
    getIncomes(userId: string): Promise<Income[]>;

    addUser(newUser: BaseUser): Promise<User>;
    editUser(user: User): Promise<User>;
    deleteUser(userId: string): Promise<void>;

    addCategory(newCategory: BaseCategory): Promise<Category>;
    editCategory(category: Category): Promise<Category>;
    deleteCategory(categoryId: string): Promise<void>;

    addExpense(newExpense: BaseExpense): Promise<Expense>;
    editExpense(expense: Expense): Promise<Expense>;
    deleteExpense(expenseId: string): Promise<void>;

    addIncome(newIncome: BaseIncome): Promise<Income>;
    editIncome(income: Income): Promise<Income>;
    deleteIncome(incomeId: string): Promise<void>;
}
