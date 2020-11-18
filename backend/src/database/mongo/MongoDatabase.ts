import mongoose from 'mongoose';
import { Category } from '../../models/category';
import { Expense } from '../../models/expense';
import { Income } from '../../models/income';
import { User } from '../../models/user';
import { Database } from '../database';

export const UserSchema = new mongoose.Schema({
    email: String,
    first_name: String,
    passwd: String,
    unallocated_funds: Number,
});

export const UserModel = mongoose.model('User', UserSchema);

export const IncomeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    income_date: Date,
    amount: Number,
    summary: String,
});
export const IncomeModel = mongoose.model<any & Document>('Income', IncomeSchema);

export const CategorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    category_name: String,
    amount: Number,
    monthly_default: Number,
});
export const CategoryModel = mongoose.model('Category', CategorySchema);

export const ExpenseSchema = new mongoose.Schema({
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
    },
    expense_date: Date,
    amount: Number,
    summary: String,
});
export const ExpenseModel = mongoose.model('Expense', ExpenseSchema);

export class MongoDatabase implements Database {
    private static singleton: MongoDatabase | null = null;

    static instance(): MongoDatabase {
        if (this.singleton === null) {
            this.singleton = new MongoDatabase();
        }
        return this.singleton;
    }

    async init(): Promise<void> {
        await mongoose.connect('mongodb://localhost:27017/budget_tracker', { useNewUrlParser: true });
    }

    loginUser(email: string, passwd: string): Promise<User> {
        throw new Error('Method not implemented.');
    }
    getUser(userId: number): Promise<User> {
        throw new Error('Method not implemented.');
    }
    getCategories(userId: number): Promise<Category[]> {
        throw new Error('Method not implemented.');
    }
    getCategory(categoryId: number): Promise<Category> {
        throw new Error('Method not implemented.');
    }
    getExpenses(userId: number): Promise<Expense[]> {
        throw new Error('Method not implemented.');
    }
    getCategoryExpenses(categoryId: number): Promise<Expense[]> {
        throw new Error('Method not implemented.');
    }
    getIncomes(userId: number): Promise<Income[]> {
        throw new Error('Method not implemented.');
    }
    addUser(newUser: Pick<User, 'email' | 'first_name' | 'last_name' | 'passwd' | 'unallocated_funds'>): Promise<User> {
        throw new Error('Method not implemented.');
    }
    editUser(user: User): Promise<User> {
        throw new Error('Method not implemented.');
    }
    deleteUser(userId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    addCategory(
        newCategory: Pick<Category, 'user_id' | 'category_name' | 'amount' | 'monthly_default'>,
    ): Promise<Category> {
        throw new Error('Method not implemented.');
    }
    editCategory(category: Category): Promise<Category> {
        throw new Error('Method not implemented.');
    }
    deleteCategory(categoryId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    addExpense(newExpense: Pick<Expense, 'category_id' | 'amount' | 'expense_date' | 'summary'>): Promise<Expense> {
        throw new Error('Method not implemented.');
    }
    editExpense(expense: Expense): Promise<Expense> {
        throw new Error('Method not implemented.');
    }
    deleteExpense(expenseId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    addIncome(newIncome: Pick<Income, 'user_id' | 'amount' | 'summary' | 'income_date'>): Promise<Income> {
        throw new Error('Method not implemented.');
    }
    editIncome(income: Income): Promise<Income> {
        throw new Error('Method not implemented.');
    }
    deleteIncome(incomeId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
