import mongoose from 'mongoose';
import {Category} from '../../models/category';
import {Expense} from '../../models/expense';
import {Income} from '../../models/income';
import {BaseUser, User} from '../../models/user';
import {Database} from '../database';

export const UserSchema = new mongoose.Schema({
    email: String,
    first_name: String,
    last_name: String,
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
        await mongoose.connect('mongodb://localhost:27017/budget_tracker', {useNewUrlParser: true});
    }

    loginUser(email: string, passwd: string): Promise<User> {
        throw new Error('Method not implemented.');
    }

    async getUser(userId: string): Promise<User> {
        const user: any = await UserModel.findById(userId);
        return {
            user_id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            passwd: user.passwd,
            unallocated_funds: user.unallocated_funds,
        };
    }

    getCategories(userId: number): Promise<Category[]> {
        throw new Error('Method not implemented.');
    }

    getCategory(categoryId: number): Promise<Category> {
        throw new Error('Method not implemented.');
    }

    // todo change to string
    getExpenses(userId: number): Promise<Expense[]> {
        // empty array of expenses
        // ExpenseModel.find(userid
        // iterate each of those (mongo objects)
        // construct (our) Expense objects
        // push into empty array
        // return it
        throw new Error('Method not implemented.');
    }

    getCategoryExpenses(categoryId: number): Promise<Expense[]> {
        throw new Error('Method not implemented.');
    }

    getIncomes(userId: number): Promise<Income[]> {
        throw new Error('Method not implemented.');
    }

    addUser(newUser: BaseUser): Promise<User> {
        let userPromise = UserModel.create({
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            passwd: newUser.passwd,
            unallocated_funds: newUser.unallocated_funds,
        });
        return userPromise.then(
            (res: any) => {

                console.log(`Created ${res} document.`);
                return {
                    user_id: res._id, // todo make sure it's treated as a string in other places
                    email: res.email,
                    first_name: res.first_name,
                    last_name: res.last_name,
                    passwd: res.passwd,
                    unallocated_funds: res.unallocated_funds,
                };
            }
        );
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
