import express, { Request } from 'express';
import { ParamsDictionary } from '..';
import { DatabaseFactory } from '../database/database-factory';
import { CreateExpensePayload, Expense } from '../models/expense';

/**
 * A router for all paths beginning with /users/:userId/categories/:categoryId/expenses
 */
const expenseRouter = express.Router({ mergeParams: true });
const db = DatabaseFactory.getDatabase();

expenseRouter.post('/', async (req: Request<ParamsDictionary, Expense, CreateExpensePayload>, res) => {
  try {
    const expense = await db.addExpense({
      ...req.body,
      category_id: parseInt(req.params.categoryId),
    });
    res.send(expense);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

expenseRouter.get('/', async (req: Request<ParamsDictionary, Expense[]>, res) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const expenses = await db.getCategoryExpenses(categoryId);
    res.send(expenses);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

expenseRouter.put('/:expenseId', async (req: Request<ParamsDictionary, Expense, Expense>, res) => {
  try {
    const expense = await db.editExpense({
      ...req.body,
    });
    res.send(expense);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

expenseRouter.delete('/:expenseId', async (req, res) => {
  const expenseId = parseInt(req.params.expenseId);
  try {
    await db.deleteIncome(expenseId);
    res.sendStatus(203);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

export { expenseRouter };
