import {Pool, PoolClient, QueryConfig, types} from 'pg';
import {BaseCategory, Category} from '../../models/category';
import {BaseExpense, Expense} from '../../models/expense';
import {BaseIncome, Income} from '../../models/income';
import {BaseUser, User} from '../../models/user';
import {Database} from '../database';

export class PgDatabase implements Database {
    private static singleton: PgDatabase | null;
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
                commit();
                return users[0];
            } catch (error) {
                rollback();
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
                commit();
                return users[0];
            } catch (error) {
                rollback();
                throw error;
            }
        });
    }

    getCategories(userId: number): Promise<Category[]> {
        return this.transaction<Category[]>(async (client, commit, rollback) => {
            try {
                const query = {
                    text: `
                        SELECT category_name, amount, monthly_default
                        FROM categories
                        WHERE categories.user_id = $1;`,
                    values: [userId],
                };
                const queryResults = await client.query<Category>(query);
                const categories = queryResults.rows;
                commit();
                return categories;
            } catch (error) {
                rollback();
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
                commit();
                return categories[0];
            } catch (error) {
                rollback();
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
                        SELECT expenses.summary,
                               round(expenses.amount::numeric, 2)   AS amount_spent,
                               expenses.expense_date,
                               categories.category_name,
                               round(categories.amount::numeric, 2) AS total_category_amount
                        FROM expenses
                                 JOIN categories ON expenses.category_id = categories.category_id
                        WHERE categories.user_id = $1;`,
                    values: [userId],
                };
                const queryResults = await client.query<Expense>(query);
                const expenses = queryResults.rows;
                commit();
                return expenses;
            } catch (error) {
                rollback();
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
                commit();
                return expenses;
            } catch (error) {
                rollback();
                throw error;
            }
        });
    }

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
                if (incomes.length !== 1) {
                    throw new Error(`User id ${userId} doesn't exist`);
                }
                commit();
                return incomes[0];
            } catch (error) {
                rollback();
                throw error;
            }
        });
    }

    addUser(newUser: BaseUser): Promise<User> {
        const {email, first_name, last_name, passwd} = newUser;
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
        const {email, first_name, last_name, passwd, user_id} = user;
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
                if (queryResult.rows.length !== 1 || queryResult.rows[0] !== 1) {
                    throw new Error(`User ${userId} could not be deleted`);
                }
                commit();
            } catch (error) {
                rollback();
                throw error;
            }
        });
    }

    addCategory(newCategory: BaseCategory): Promise<Category> {
        throw new Error('Method not implemented.');
    }

    editCategory(category: Category): Promise<Category> {
        throw new Error('Method not implemented.');
    }

    deleteCategory(categoryId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }

    addExpense(newExpense: BaseExpense): Promise<Expense> {
        throw new Error('Method not implemented.');
    }

    editExpense(expense: Expense): Promise<Expense> {
        throw new Error('Method not implemented.');
    }

    deleteExpense(expenseId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }

    addIncome(newIncome: BaseIncome): Promise<Income> {
        const {amount, income_date, summary} = newIncome;
        return this.transaction<Income>(async (client, commit, rollback) => {
            try {
                const queryResult = await client.query<Income>({
                    text: `
                        INSERT INTO incomes (amount, income_date, summary)
                        VALUES ($1, $2, $3);
                        RETURNING *;`,
                    values: [amount, income_date, summary],
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
        const {income_id, user_id, amount, income_date, summary} = income;
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
                if (queryResult.rows.length !== 1 || queryResult.rows[0] !== 1) {
                    throw new Error(`Income ${incomeId} could not be deleted`);
                }
                commit();
            } catch (error) {
                rollback();
                throw error;
            }
        });
    }
}
