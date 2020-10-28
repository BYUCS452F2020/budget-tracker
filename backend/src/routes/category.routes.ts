import express, { Request } from 'express';
import { ParamsDictionary } from '..';
import { DatabaseFactory } from '../database/database-factory';
import { Category, CreateCategoryPayload } from '../models/category';

/**
 * A router for all paths beginning with /users/:userId/categories
 */
const categoryRouter = express.Router({ mergeParams: true });
const db = DatabaseFactory.getDatabase();

categoryRouter.post('/', async (req: Request<ParamsDictionary, Category, CreateCategoryPayload>, res) => {
  try {
    const category = await db.addCategory({
      ...req.body,
      user_id: parseInt(req.params.userId),
    });
    res.send(category);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

categoryRouter.get('/', async (req: Request<ParamsDictionary, Category[]>, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const categories = await db.getCategories(userId);
    res.send(categories);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

categoryRouter.get('/:categoryId', async (req: Request<ParamsDictionary, Category>, res) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const category = await db.getCategory(categoryId);
    res.send(category);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

categoryRouter.put('/:categoryId', async (req: Request<ParamsDictionary, Category, Category>, res) => {
  try {
    const category = await db.editCategory({
      ...req.body,
    });
    res.send(category);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

categoryRouter.delete('/:categoryId', async (req: Request<ParamsDictionary>, res) => {
  const categoryId = parseInt(req.params.categoryId);
  try {
    await db.deleteIncome(categoryId);
    res.sendStatus(203);
  } catch (error) {
    res.send(error.message).status(500);
  }
});

export { categoryRouter };
