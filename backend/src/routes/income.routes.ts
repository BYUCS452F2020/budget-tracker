import express, { Request } from 'express';
import { ParamsDictionary } from '..';
import { DatabaseFactory } from '../database/database-factory';
import { CreateIncomePayload, Income } from '../models/income';

/**
 * A router for all paths beginning with /users/:userId/incomes
 */
const incomeRouter = express.Router({ mergeParams: true });
const db = DatabaseFactory.getDatabase();

incomeRouter.post('/', async (req: Request<ParamsDictionary, Income, CreateIncomePayload>, res) => {
  try {
    const income = await db.addIncome({
      ...req.body,
      user_id: parseInt(req.params.userId),
    });
    res.send(income);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

incomeRouter.get('/', async (req: Request<ParamsDictionary, Income[]>, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const incomes = await db.getIncomes(userId);
    res.send(incomes);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

incomeRouter.put('/:incomeId', async (req: Request<ParamsDictionary, Income, Income>, res) => {
  try {
    const income = await db.editIncome({
      ...req.body,
    });
    res.send(income);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

incomeRouter.delete('/:incomeId', async (req: Request<ParamsDictionary>, res) => {
  const incomeId = parseInt(req.params.incomeId);
  try {
    await db.deleteIncome(incomeId);
    res.sendStatus(203);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

export { incomeRouter };
