import express, { Request } from 'express';
import { ParamsDictionary } from '..';
import { DatabaseFactory } from '../database/database-factory';
import { Expense } from '../models/expense';
import { CreateUserPayload, User } from '../models/user';

/**
 * A router for all paths beginning with /users
 */
const userRouter = express.Router({ mergeParams: true });
const db = DatabaseFactory.getDatabase();

userRouter.post('/', async (req: Request<ParamsDictionary, User, CreateUserPayload>, res) => {
    try {
        console.log(`reqBody: ${req.body}`);
        const user = await db.addUser(req.body);
        res.send(user);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

userRouter.get('/:userId', async (req: Request<ParamsDictionary, User>, res) => {
    try {
        const user = await db.getUser(req.params.userId);
        res.send(user);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

userRouter.put('/:userId', async (req: Request<ParamsDictionary, User, User>, res) => {
    try {
        const user = await db.editUser({
            ...req.body,
        });
        res.send(user);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

userRouter.delete('/:userId', async (req: Request<ParamsDictionary>, res) => {
    try {
        await db.deleteUser(req.params.userId);
        res.sendStatus(204);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

userRouter.get('/:userId/expenses', async (req: Request<ParamsDictionary, Expense[]>, res) => {
    try {
        const expenses = await db.getExpenses(req.params.userId);
        res.send(expenses);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

userRouter.post('/login', async (req: Request<ParamsDictionary, User>, res) => {
    try {
        const user = await db.loginUser(req.body.email, req.body.passwd);
        res.send(user);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

export { userRouter };
