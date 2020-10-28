import express from 'express';
import { DatabaseFactory } from '../database/database-factory';

/**
 * A router for all paths beginning with /users/:userId/categories
 */
const categoryRouter = express.Router({ mergeParams: true });
const db = DatabaseFactory.getDatabase();

categoryRouter.post('/', async (req, res) => {
  try {
    const category = await db.addCategory(req.body);
    res.send(category);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

categoryRouter.get('/', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const categories = await db.getCategories(userId);
    res.send(categories);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

categoryRouter.get('/:categoryId', async (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const category = await db.getCategory(categoryId);
    res.send(category);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

categoryRouter.put('/:categoryId', async (req, res) => {
  try {
    const category = await db.editCategory({
      ...req.body,
      user_id: parseInt(req.params.userId),
      category_id: parseInt(req.params.categoryId),
    });
    res.send(category);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

categoryRouter.delete('/:categoryId', async (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    await db.deleteIncome(categoryId);
    res.sendStatus(203);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

export { categoryRouter };
