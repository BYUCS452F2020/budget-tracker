import express from 'express';
import { DatabaseFactory } from '../database/database-factory';

/**
 * A router for all paths beginning with /users/:userId/incomes
 */
const incomeRouter = express.Router({ mergeParams: true });
const db = DatabaseFactory.getDatabase();

incomeRouter.post('/', async (req, res) => {
  try {
    const income = await db.addIncome(req.body);
    res.send(income);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

incomeRouter.get('/', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const incomes = await db.getIncomes(userId);
    res.send(incomes);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

incomeRouter.put('/:incomeId', async (req, res) => {
  try {
    const income = await db.editIncome({
      ...req.body,
      user_id: req.params.userId,
      income_id: req.params.incomeId,
    });
    res.send(income);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

incomeRouter.delete('/:incomeId', async (req, res) => {
  const incomeId = parseInt(req.params.incomeId);
  try {
    await db.deleteIncome(incomeId);
    res.sendStatus(203);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

export { incomeRouter };
