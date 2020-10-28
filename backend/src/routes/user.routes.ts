import express from 'express';
import { DatabaseFactory } from '../database/database-factory';

/**
 * A router for all paths beginning with /users
 */
const userRouter = express.Router({ mergeParams: true });

userRouter.post('/', async (req, res) => {
  const db = DatabaseFactory.getDatabase();
  try {
    const user = await db.addUser(req.body);
    res.send(user);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

userRouter.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const db = DatabaseFactory.getDatabase();
  try {
    const user = await db.getUser(userId);
    res.send(user);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

userRouter.put('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const db = DatabaseFactory.getDatabase();
  try {
    const user = await db.editUser(req.body);
    res.sendStatus(203);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

userRouter.delete('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const db = DatabaseFactory.getDatabase();
  try {
    const user = await db.deleteUser(userId);
    res.sendStatus(203);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

userRouter.get('/:userId/expenses', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const db = DatabaseFactory.getDatabase();
  try {
    const expenses = await db.getExpenses(userId);
    res.send(expenses);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

userRouter.post('/:userId/login', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const db = DatabaseFactory.getDatabase();
  try {
    const user = await db.loginUser(req.body.email, req.body.passwd);
    res.send(user);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

export { userRouter };
