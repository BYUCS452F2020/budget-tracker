import { Pool, PoolClient, QueryConfig, types } from 'pg';
import { BaseCategory, Category } from '../../models/category';
import { BaseExpense, Expense } from '../../models/expense';
import { BaseIncome, Income } from '../../models/income';
import { BaseUser, User } from '../../models/user';
import { Database } from '../database';

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
            SELECT 
              users.user_id,
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
    throw new Error('Method not implemented.');
  }
  getCategory(categoryId: number): Promise<Category> {
    throw new Error('Method not implemented.');
  }

  getExpenses(userId: number): Promise<Expense[]> {
    return this.transaction<Expense[]>(async (client, commit, rollback) => {
      try {
        const query = {
          text: `
            SELECT 
              expenses.summary, 
              round(expenses.amount::numeric, 2) AS amount_spent, 
              expenses.expense_date, 
              categories.category_name, 
              round(categories.amount::numeric, 2) AS total_category_amount 
            FROM expenses JOIN categories ON expenses.category_id = categories.category_id 
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

  getCategoryExpenses(categoryId: number): Promise<Expense[]> {
    throw new Error('Method not implemented.');
  }

  getIncomes(userId: number): Promise<Income[]> {
    throw new Error('Method not implemented.');
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
            SET
              email       = $1,
              first_name  = $2,
              last_name   = $3,
              passwd      = $4
            WHERE
              user_id     = $5
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
    throw new Error('Method not implemented.');
  }
  editIncome(income: Income): Promise<Income> {
    throw new Error('Method not implemented.');
  }
  deleteIncome(incomeId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
