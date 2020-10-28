import express from 'express';
import { DatabaseFactory } from '../database/database-factory';

/**
 * A router for all paths beginning with /users
 */
const userRouter = express.Router({ mergeParams: true });
const db = DatabaseFactory.getDatabase();

userRouter.post('/', async (req, res) => {
  try {
    const user = await db.addUser(req.body);
    res.send(user);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

userRouter.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const user = await db.getUser(userId);
    res.send(user);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

userRouter.put('/:userId', async (req, res) => {
  try {
    const user = await db.editUser({
      ...req.body,
      user_id: parseInt(req.params.userId),
    });
    res.send(user);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

userRouter.delete('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    await db.deleteUser(userId);
    res.sendStatus(203);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

userRouter.get('/:userId/expenses', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const expenses = await db.getExpenses(userId);
    res.send(expenses);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const user = await db.loginUser(req.body.email, req.body.passwd);
    res.send(user);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

export { userRouter };
