import mongoose from 'mongoose';
import {BaseCategory, Category} from '../../models/category';
import {BaseExpense, Expense} from '../../models/expense';
import {BaseIncome, Income} from '../../models/income';
import {BaseUser, User} from '../../models/user';
import {Database} from '../database';

// TODO update allocated funds when creating categories...
// TODO etc. expense vs categories

// ******************
// Schemas and models
// ******************

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

// this is to resolve some deprecation warnings
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

// ****************************
// MongoDatabase implementation
// ****************************

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
        // todo this is a post, see pg
        throw new Error('Method not implemented.');
    }

    getUser(userId: string): Promise<User> {
        let userGetPromise: any = UserModel.findById(userId);
        return userGetPromise.then(
            (res: any) => {
                console.log(`Retrieved ${res} user document.`);
                return {
                    user_id: res._id,
                    email: res.email,
                    first_name: res.first_name,
                    last_name: res.last_name,
                    passwd: res.passwd,
                    unallocated_funds: res.unallocated_funds,
                };
            }
        )
    };

    async getCategories(userId: string): Promise<Category[]> {
        let balanceCategories: Category[];
        balanceCategories = [];
        let mongoCategories: any[];
        mongoCategories = await CategoryModel.find({user: userId});
        mongoCategories.forEach(category => {
            console.log(`Retrieved ${category} category from document.`);
            balanceCategories.push({
                category_id: category._id,
                user_id: category.user_id,
                category_name: category.category_name,
                amount: category.amount,
                monthly_default: category.monthly_default
            })
        });
        return balanceCategories;

    }

    getCategory(categoryId: string): Promise<Category> {
        let categoryGetPromise: any = CategoryModel.findById(categoryId);
        return categoryGetPromise.then(
            (res: any) => {
                console.log(`Retrieved ${res} category document.`);
                return {
                    category_id: res._id,
                    category_name: res.category_name,
                    amount: res.amount,
                    monthly_default: res.monthly_default,
                    user: res.user,
                };
            }
        )
    }

    // fixme need to lookup user from category...
    async getExpenses(userId: string): Promise<Expense[]> {
        let results: Expense[];
        results = [];
        let expenses: any[];
        expenses = await ExpenseModel.find({user: userId});
        expenses.forEach(expense => {
            console.log(`Retrieved ${expense} expense from document.`);
            results.push({
                expense_id: expense._id,
                category_id: expense.category_id,
                expense_date: expense.expense_date,
                amount: expense.amount,
                summary: expense.summary,
            })
        });
        return results;
    }

    async getCategoryExpenses(categoryId: string): Promise<Expense[]> {
        let results: Expense[];
        results = [];
        let expenses: any[];
        expenses = await ExpenseModel.find({category: categoryId});
        expenses.forEach(expense => {
            console.log(`Retrieved ${expense} expense from document.`);
            results.push({
                expense_id: expense._id,
                category_id: expense.category_id,
                expense_date: expense.expense_date,
                amount: expense.amount,
                summary: expense.summary,
            })
        });
        return results;
    }

    async getIncomes(userId: string): Promise<Income[]> {
        let results: Income[];
        results = [];
        let incomes: any[];
        incomes = await IncomeModel.find({user: userId});
        incomes.forEach(income => {
            console.log(`Retrieved ${income} income from document.`);
            results.push({
                income_id: income._id,
                user_id: income.user_id,
                amount: income.amount,
                summary: income.summary,
                income_date: income.income_date
            })
        });
        return results;
    }

    addUser(newUser: BaseUser): Promise<User> {
        console.log(`NewUser is ${newUser}`);
        let userAddPromise = UserModel.create({
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            passwd: newUser.passwd,
            unallocated_funds: newUser.unallocated_funds,
        });
        return userAddPromise.then(
            (res: any) => {
                console.log(`Created ${res} user document.`);
                return {
                    user_id: res._id,
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
        let userUpdatePromise = UserModel.findByIdAndUpdate(user.user_id,
            {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                passwd: user.passwd,
                unallocated_funds: user.unallocated_funds,
            }
        );

        return userUpdatePromise.then(
            (res: any) => {
                console.log(`Updated ${res} user document.`);
                return {
                    user_id: res._id,
                    email: res.email,
                    first_name: res.first_name,
                    last_name: res.last_name,
                    passwd: res.passwd,
                    unallocated_funds: res.unallocated_funds,
                };
            }
        );
    }

    deleteUser(userId: string): Promise<void> {
        let userDeletePromise = UserModel.deleteOne({_id: userId});
        return userDeletePromise.then(
            (res: any) => {
                console.log(`Deleted a user.`);
                return;
            }
        );
    }

    addCategory(newCategory: BaseCategory,): Promise<Category> {
        throw new Error('Method not implemented.');
    }

    editCategory(category: Category): Promise<Category> {
        throw new Error('Method not implemented.');
    }

    deleteCategory(categoryId: string): Promise<void> {
        let categoryDeletePromise = CategoryModel.deleteOne({_id: categoryId});
        return categoryDeletePromise.then(
            (res: any) => {
                console.log(`Deleted a category.`);
                return;
            }
        );
    }

    addExpense(newExpense: BaseExpense): Promise<Expense> {
        throw new Error('Method not implemented.');
    }

    editExpense(expense: Expense): Promise<Expense> {
        throw new Error('Method not implemented.');
    }

    deleteExpense(expenseId: string): Promise<void> {
        let expenseDeletePromise = ExpenseModel.deleteOne({_id: expenseId});
        return expenseDeletePromise.then(
            (res: any) => {
                console.log(`Deleted an expense.`);
                return;
            }
        );
    }

    addIncome(newIncome: BaseIncome): Promise<Income> {
        throw new Error('Method not implemented.');
    }

    editIncome(income: Income): Promise<Income> {
        throw new Error('Method not implemented.');
    }

    deleteIncome(incomeId: string): Promise<void> {
        let incomeDeletePromise = IncomeModel.deleteOne({_id: incomeId});
        return incomeDeletePromise.then(
            (res: any) => {
                console.log(`Deleted an income.`);
                return;
            }
        );
    }
}
