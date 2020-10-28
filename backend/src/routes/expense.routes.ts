import express from 'express';
import { DatabaseFactory } from '../database/database-factory';

/**
 * A router for all paths beginning with /users/:userId/categories/:categoryId/expenses
 */
const expenseRouter = express.Router({ mergeParams: true });
const db = DatabaseFactory.getDatabase();

expenseRouter.post('/', async (req, res) => {
  try {
    const expense = await db.addExpense(req.body);
    res.send(expense);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

expenseRouter.get('/', async (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const expenses = await db.getCategoryExpenses(categoryId);
    res.send(expenses);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

expenseRouter.put('/:expenseId', async (req, res) => {
  try {
    const expense = await db.editExpense({
      ...req.body,
      user_id: parseInt(req.params.userId),
      category_id: parseInt(req.params.categoryId),
      expense_id: parseInt(req.params.expenseId),
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
