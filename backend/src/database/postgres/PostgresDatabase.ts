import { Pool, PoolClient, QueryConfig, types } from 'pg';
import { BaseCategory, Category } from '../../models/category';
import { BaseExpense, Expense } from '../../models/expense';
import { BaseIncome, Income } from '../../models/income';
import { BaseUser, User } from '../../models/user';
import { Database } from '../database';

export class PgDatabase implements Database {
    private static singleton: PgDatabase | null = null;
    private static readonly pool = new Pool();

    static instance(): PgDatabase {
        if (this.singleton === null) {
            this.singleton = new PgDatabase();
        }
        return this.singleton;
    }

    private constructor() {
        // For when query results parse postgres types to typescript types
        types.setTypeParser(23, parseInt); // 23 represents int types in pg
        types.setTypeParser(701, parseFloat); // 701 represents double precision in pg
    }

    async init(): Promise<void> {}

    private async transaction<T>(
        action: (c: PoolClient, commit: () => Promise<void>, rollback: () => Promise<void>) => Promise<T>,
    ): Promise<T> {
        const client = await PgDatabase.pool.connect();
        await client.query('BEGIN');

        const transactionResult = action(
            client,
            async () => {
                await client.query('COMMIT');
            },
            async () => {
                await client.query('ROLLBACK');
            },
        );

        client.release();
        return transactionResult;
    }

    loginUser(email: string, password: string): Promise<User> {
        const user = this.transaction<User>(async (client, commit, rollback) => {
            try {
                const query: QueryConfig = {
                    text: `
                        SELECT users.user_id,
                               CONCAT(users.first_name, ' ', users.last_name) AS full_name,
                               users.email,
                               users.unallocated_funds
                        FROM users
                        WHERE users.email = $1
                          AND users.passwd = $2;`,
                    values: [email, password],
                };
                const queryResults = await client.query<User>(query);
                const users = queryResults.rows;
                if (users.length !== 1) {
                    throw new Error("Credentials don't match");
                }
                await commit();
                return users[0];
            } catch (error) {
                await rollback();
                throw error;
            }
        });
        return user;
    }

    getUser(userId: number): Promise<User> {
        return this.transaction<User>(async (client, commit, rollback) => {
            try {
                const query = {
                    text: `
                        SELECT *
                        FROM users
                        WHERE user_id = $1;`,
                    values: [userId],
                };
                const queryResults = await client.query<User>(query);
                const users = queryResults.rows;
                if (users.length !== 1) {
                    throw new Error(`User id ${userId} doesn't exist`);
                }
                await commit();
                return users[0];
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    getCategories(userId: number): Promise<Category[]> {
        return this.transaction<Category[]>(async (client, commit, rollback) => {
            try {
                const query = {
                    text: `
                        SELECT *
                        FROM categories
                        WHERE categories.user_id = $1;`,
                    values: [userId],
                };
                const queryResults = await client.query<Category>(query);
                const categories = queryResults.rows;
                await commit();
                return categories;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    getCategory(categoryId: number): Promise<Category> {
        return this.transaction<Category>(async (client, commit, rollback) => {
            try {
                const query = {
                    text: `
                        SELECT *
                        FROM categories
                        WHERE category_id = $1;`,
                    values: [categoryId],
                };
                const queryResults = await client.query<Category>(query);
                const categories = queryResults.rows;
                if (categories.length !== 1) {
                    throw new Error(`Category id ${categoryId} doesn't exist`);
                }
                await commit();
                return categories[0];
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    /**
     * Get all user expenses across all categories.
     * @param userId the userID key
     */
    getExpenses(userId: number): Promise<Expense[]> {
        return this.transaction<Expense[]>(async (client, commit, rollback) => {
            try {
                const query = {
                    text: `
                        SELECT 
                               expenses.expense_id,
                               expenses.summary,
                               round(expenses.amount::numeric, 2) AS amount,
                               expenses.expense_date,
                               expenses.category_id,
                               categories.category_name,
                               round(categories.amount::numeric, 2) AS total_category_amount
                        FROM expenses
                                 JOIN categories ON expenses.category_id = categories.category_id
                        WHERE categories.user_id = $1;`,
                    values: [userId],
                };
                const queryResults = await client.query<Expense>(query);
                const expenses = queryResults.rows;
                await commit();
                return expenses;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    /**
     * Get all expenses for a user in just one specific category
     * @param categoryId the categoryID key
     */
    getCategoryExpenses(categoryId: number): Promise<Expense[]> {
        return this.transaction<Expense[]>(async (client, commit, rollback) => {
            try {
                const query = {
                    text: `
                        SELECT *
                        FROM expenses
                        WHERE category_id = $1;`,
                    values: [categoryId],
                };
                const queryResults = await client.query<Expense>(query);
                const expenses = queryResults.rows;
                await commit();
                return expenses;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    /**
     * Gets all incomes for a specified user.
     * @param userId the userID key
     */
    getIncomes(userId: number): Promise<Income[]> {
        return this.transaction<Income[]>(async (client, commit, rollback) => {
            try {
                const query = {
                    text: `
                        SELECT *
                        FROM incomes
                        WHERE user_id = $1;`,
                    values: [userId],
                };
                const queryResults = await client.query<Income>(query);
                const incomes = queryResults.rows;
                await commit();
                return incomes;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    addUser(newUser: BaseUser): Promise<User> {
        const { email, first_name, last_name, passwd } = newUser;
        return this.transaction<User>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query<User>({
                    text: `
                        INSERT INTO users (email, first_name, last_name, passwd)
                        VALUES ($1, $2, $3, $4)
                        RETURNING *;`,
                    values: [email, first_name, last_name, passwd],
                });
                const createdUser = queryResult.rows[0];
                await commit();
                return createdUser;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    editUser(user: User): Promise<User> {
        const { email, first_name, last_name, passwd, user_id } = user;
        return this.transaction<User>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query<User>({
                    text: `
                        UPDATE users
                        SET email      = $1,
                            first_name = $2,
                            last_name  = $3,
                            passwd     = $4
                        WHERE user_id = $5
                        RETURNING *;`,
                    values: [email, first_name, last_name, passwd, user_id],
                });
                const users = queryResult.rows;
                if (users.length !== 1) {
                    throw new Error(`User ${user_id} could not be updated`);
                }
                const updatedUser = queryResult.rows[0];
                await commit();
                return updatedUser;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    deleteUser(userId: number): Promise<void> {
        return this.transaction<void>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query({
                    text: `
                        DELETE
                        FROM users
                        WHERE user_id = $1;`,
                    values: [userId],
                });
                if (queryResult.rowCount !== 1) {
                    throw new Error(`User ${userId} could not be deleted`);
                }
                await commit();
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    addCategory(newCategory: BaseCategory): Promise<Category> {
        const { user_id, category_name, amount, monthly_default } = newCategory;
        return this.transaction<Category>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query<Category>({
                    text: `
                    INSERT INTO categories (user_id, category_name, amount, monthly_default)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *;`,
                    values: [user_id, category_name, amount, monthly_default],
                });
                const createdCategory = queryResult.rows[0];
                await commit();
                return createdCategory;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    editCategory(category: Category): Promise<Category> {
        const { category_id, category_name, amount, monthly_default } = category;
        return this.transaction<Category>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query<Category>({
                    text: `
                        UPDATE categories
                        SET category_name   = $1,
                            amount          = $2,
                            monthly_default = $3
                        WHERE category_id = $4
                        RETURNING *;`,
                    values: [category_name, amount, monthly_default, category_id],
                });
                const categories = queryResult.rows;
                if (categories.length !== 1) {
                    throw new Error(`Category ID ${category_id} could not be updated`);
                }
                const updatedCategory = queryResult.rows[0];
                await commit();
                return updatedCategory;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    deleteCategory(categoryId: number): Promise<void> {
        return this.transaction<void>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query({
                    text: `
                        DELETE
                        FROM categories
                        WHERE category_id = $1;`,
                    values: [categoryId],
                });
                if (queryResult.rowCount !== 1) {
                    throw new Error(`Category ${categoryId} could not be deleted`);
                }
                await commit();
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    addExpense(newExpense: BaseExpense): Promise<Expense> {
        const { category_id, amount, expense_date, summary } = newExpense;
        return this.transaction<Expense>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query<Expense>({
                    text: `
                        INSERT INTO expenses (category_id, amount, expense_date, summary)
                        VALUES ($1, $2, $3, $4)
                        RETURNING *;`,
                    values: [category_id, amount, expense_date, summary],
                });
                const createdExpense = queryResult.rows[0];
                await commit();
                return createdExpense;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    editExpense(expense: Expense): Promise<Expense> {
        const { category_id, amount, expense_date, summary, expense_id } = expense;
        return this.transaction<Expense>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query<Expense>({
                    text: `
                        UPDATE expenses
                        SET category_id  = $1,
                            amount       = $2,
                            expense_date = $3,
                            summary      = $4
                        WHERE expense_id = $5
                        RETURNING *;`,
                    values: [category_id, amount, expense_date, summary, expense_id],
                });
                const expenses = queryResult.rows;
                if (expenses.length !== 1) {
                    throw new Error(`Expense ${expense_id} could not be updated`);
                }
                const updatedExpense = queryResult.rows[0];
                await commit();
                return updatedExpense;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    deleteExpense(expenseId: number): Promise<void> {
        return this.transaction<void>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query({
                    text: `
                        DELETE
                        FROM expenses
                        WHERE expense_id = $1;`,
                    values: [expenseId],
                });
                if (queryResult.rowCount !== 1) {
                    throw new Error(`Expense ${expenseId} could not be deleted`);
                }
                await commit();
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    addIncome(newIncome: BaseIncome): Promise<Income> {
        const { amount, income_date, summary, user_id } = newIncome;
        return this.transaction<Income>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query<Income>({
                    text: `
                        INSERT INTO incomes (amount, income_date, summary, user_id)
                        VALUES ($1, $2, $3, $4)
                        RETURNING *;`,
                    values: [amount, income_date, summary, user_id],
                });
                const createdIncome = queryResult.rows[0];
                await commit();
                return createdIncome;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    editIncome(income: Income): Promise<Income> {
        const { income_id, user_id, amount, income_date, summary } = income;
        return this.transaction<Income>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query<Income>({
                    text: `
                        UPDATE incomes
                        SET amount      = $1,
                            income_date = $2,
                            summary     = $3
                        WHERE income_id = $4
                        RETURNING *;`,
                    values: [amount, income_date, summary, income_id],
                });
                const incomes = queryResult.rows;
                if (incomes.length !== 1) {
                    throw new Error(`Income ${income_id} could not be updated`);
                }
                const updatedIncome = queryResult.rows[0];
                await commit();
                return updatedIncome;
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }

    deleteIncome(incomeId: number): Promise<void> {
        return this.transaction<void>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query({
                    text: `
                        DELETE
                        FROM incomes
                        WHERE income_id = $1;`,
                    values: [incomeId],
                });
                if (queryResult.rowCount !== 1) {
                    throw new Error(`Income ${incomeId} could not be deleted`);
                }
                await commit();
            } catch (error) {
                await rollback();
                throw error;
            }
        });
    }
}
