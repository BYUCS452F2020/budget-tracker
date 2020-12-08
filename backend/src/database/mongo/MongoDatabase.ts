import mongoose from 'mongoose';
import {BaseCategory, Category} from '../../models/category';
import {BaseExpense, Expense} from '../../models/expense';
import {BaseIncome, Income} from '../../models/income';
import {BaseUser, User} from '../../models/user';
import {Database} from '../database';

// TODO update allocated funds when creating categories...
// TODO etc. expense vs categories

// TODO verify that dates are processed correctly from frontend for addExpense and addIncome

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
        let userGetPromise: any = UserModel.findOne(
            {
                email: email,
                passwd: passwd,
            }
        );
        return userGetPromise.then(
            (res: any) => {
                console.log(`Logging in user ${res}.`);
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

    async getExpenses(userId: string): Promise<Expense[]> {
        let allUserExpenses: Expense[] = [];
        let balanceCategories = await this.getCategories(userId);

        balanceCategories.forEach(category => {
            let balanceExpenses: Expense[];
            ExpenseModel.find({category: category.category_id}).then((res: any[]) => {
                balanceExpenses = this.getExpensesFromMongoExpenses(res);
                allUserExpenses = allUserExpenses.concat(balanceExpenses);
            });
        });

        return allUserExpenses;
    }

    async getCategoryExpenses(categoryId: string): Promise<Expense[]> {
        let mongoExpenses: any[];
        mongoExpenses = await ExpenseModel.find({category: categoryId});
        return this.getExpensesFromMongoExpenses(mongoExpenses);
    }

    /**
     * A helper function for getExpenses() and getCategoryExpenses()
     */
    getExpensesFromMongoExpenses(mongoPromise: any[]): Expense[] {
        let balanceExpenses: Expense[];
        balanceExpenses = [];
        mongoPromise.forEach(expense => {
            console.log(`Retrieved ${expense} expense from document.`);
            balanceExpenses.push({
                expense_id: expense._id,
                category_id: expense.category_id,
                expense_date: expense.expense_date,
                amount: expense.amount,
                summary: expense.summary,
            })
        });

        return balanceExpenses;
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
                console.log(`Updated from ${res} user document to something else.`);
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

    async addCategory(newCategory: BaseCategory,): Promise<Category> {
        console.log(`New Category is ${newCategory}`);
        let user: any = await UserModel.findById(newCategory.user_id);
        let newUnallocatedFunds = user.unallocated_funds - newCategory.amount;

        await user.update(
            {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                passwd: user.passwd,
                unallocated_funds: newUnallocatedFunds,
            }
        );

        let categoryAddPromise = CategoryModel.create({
            user: newCategory.user_id,
            category_name: newCategory.category_name,
            amount: newCategory.amount,
            monthly_default: newCategory.monthly_default,
        });
        return categoryAddPromise.then(
            (res: any) => {
                console.log(`Created ${res} category document.`);
                return {
                    category_id: res._id,
                    category_name: res.category_name,
                    amount: res.amount,
                    monthly_default: res.monthly_default,
                    user_id: res.user_id,
                };
            }
        );
    }

    async editCategory(category: Category): Promise<Category> {
        let categoryToUpdate: any = await CategoryModel.findById(category.category_id);
        let user: any = await UserModel.findById(category.user_id);
        let categoryDiffAmount = categoryToUpdate.amount - category.amount;
        let newUnallocatedFunds = user.unallocated_funds + categoryDiffAmount;

        await user.update(
            {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                passwd: user.passwd,
                unallocated_funds: newUnallocatedFunds,
            }
        );

        await categoryToUpdate.update(
            {
                user_id: category.user_id,
                category_id: category.category_id,
                category_name: category.category_name,
                amount: category.amount,
                monthly_default: category.monthly_default,
            }
        );
        console.log(`Updated ${categoryToUpdate} category document.`);
        return {
            category_id: categoryToUpdate._id,
            user_id: categoryToUpdate.user_id,
            category_name: categoryToUpdate.category_name,
            amount: categoryToUpdate.amount,
            monthly_default: categoryToUpdate.monthly_default,
        };
    }

    deleteCategory(categoryId: string): Promise<void> {
        // todo: update unallocated funds
        let categoryDeletePromise = CategoryModel.deleteOne({_id: categoryId});
        return categoryDeletePromise.then(
            (res: any) => {
                console.log(`Deleted a category.`);
                return;
            }
        );
    }

    async addExpense(newExpense: BaseExpense): Promise<Expense> {
        console.log(`New Expense is ${newExpense}`);

        let expense: any = await ExpenseModel.create({
            category_id: newExpense.category_id,
            expense_date: newExpense.expense_date,
            amount: newExpense.amount,
            summary: newExpense.summary,
        });
        let category: any = await CategoryModel.findById(newExpense.category_id);
        let newCatAmount = category.amount - newExpense.amount;

        await category.update(
            {
                _id: category._id,
                user_id: category.user_id,
                category_id: category.category_id,
                category_name: category.category_name,
                amount: newCatAmount,
                monthly_default: category.monthly_default,
            }
        );

        console.log(`Created ${expense} expense document.`);
        return {
            expense_id: expense._id,
            category_id: expense.category_id,
            expense_date: expense.expense_date,
            amount: expense.amount,
            summary: expense.summary,
        };

    }

    async editExpense(expense: Expense): Promise<Expense> {
        let expenseToUpdate: any = await ExpenseModel.findById(expense.expense_id);
        let category: any = await CategoryModel.findById(expense.category_id);
        let expenseDiffAmount = expenseToUpdate.amount - expense.amount;
        let newCatAmount = category.amount + expenseDiffAmount;

        await category.update(
            {
                _id: category._id,
                user_id: category.user_id,
                category_id: category.category_id,
                category_name: category.category_name,
                amount: newCatAmount,
                monthly_default: category.monthly_default,
            }
        );

        await expenseToUpdate.update(
            {
                expense_id: expense.expense_id,
                category_id: expense.category_id,
                expense_date: expense.expense_date,
                amount: expense.amount,
                summary: expense.summary,
            }
        );
        console.log(`Updated ${expenseToUpdate} expense document.`);
        return {
            expense_id: expenseToUpdate._id,
            category_id: expenseToUpdate.category_id,
            expense_date: expenseToUpdate.expense_date,
            amount: expenseToUpdate.amount,
            summary: expenseToUpdate.summary,
        };
    }

    async deleteExpense(expenseId: string): Promise<void> {
        let expenseToDelete: any = await ExpenseModel.findById(expenseId);
        let category: any = await CategoryModel.findById(expenseToDelete.category_id);
        let newCatAmount = category.amount + expenseToDelete.amount;

        await category.update(
            {
                _id: category._id,
                user_id: category.user_id,
                category_id: category.category_id,
                category_name: category.category_name,
                amount: newCatAmount,
                monthly_default: category.monthly_default,
            }
        );
        await expenseToDelete.delete();
        console.log(`Deleted an expense.`);
    }

    async addIncome(newIncome: BaseIncome): Promise<Income> {
        console.log(`New Income is ${newIncome}`);
        let incomeAddPromise = IncomeModel.create({
            user_id: newIncome.user_id,
            income_date: newIncome.income_date,
            amount: newIncome.amount,
            summary: newIncome.summary,
        });

        let user: any = await UserModel.findById(newIncome.user_id);
        let newUnallocatedFunds = user.unallocated_funds + newIncome.amount;

        await user.update(
            {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                passwd: user.passwd,
                unallocated_funds: newUnallocatedFunds,
            }
        );

        return incomeAddPromise.then(
            (res: any) => {
                console.log(`Created ${res} income document.`);
                return {
                    income_id: res._id,
                    user_id: res.user_id,
                    income_date: res.income_date,
                    amount: res.amount,
                    summary: res.summary,
                };
            }
        );
    }

    async editIncome(income: Income): Promise<Income> {
        let incomeToUpdate: any = await IncomeModel.findById(income.income_id);
        let user: any = await UserModel.findById(income.user_id);
        let incomeDiffAmount = incomeToUpdate.amount - income.amount;
        let newUnallocatedFunds = user.unallocated_funds - incomeDiffAmount;

        await user.update(
            {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                passwd: user.passwd,
                unallocated_funds: newUnallocatedFunds,
            }
        );
        await incomeToUpdate.update(
            {
                income_id: income.income_id,
                user_id: income.user_id,
                amount: income.amount,
                summary: income.summary,
                income_date: income.income_date,
            }
        );

        console.log(`Updated ${incomeToUpdate} income document.`);
        return {
            income_id: incomeToUpdate._id,
            user_id: incomeToUpdate.user_id,
            amount: incomeToUpdate.amount,
            summary: incomeToUpdate.summary,
            income_date: incomeToUpdate.income_date,
        };
    }

    async deleteIncome(incomeId: string): Promise<void> {
        let income: any = await IncomeModel.findById(incomeId);
        let user: any = await UserModel.findById(income.user_id);
        let newUnallocatedFunds = user.unallocated_funds - income.amount;
        await user.update(
            {
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                passwd: user.passwd,
                unallocated_funds: newUnallocatedFunds,
            }
        );
        await income.delete();
        console.log(`Deleted an income.`);
    }
}
