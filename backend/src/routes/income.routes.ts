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
            user_id: req.params.userId,
        });
        res.send(income);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

incomeRouter.get('/', async (req: Request<ParamsDictionary, Income[]>, res) => {
    try {
        const incomes = await db.getIncomes(req.params.userId);
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
    try {
        await db.deleteIncome(req.params.incomeId);
        res.sendStatus(204);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

export { incomeRouter };
