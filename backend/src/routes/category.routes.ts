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
            user_id: req.params.userId,
        });
        res.send(category);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

categoryRouter.get('/', async (req: Request<ParamsDictionary, Category[]>, res) => {
    try {
        const categories = await db.getCategories(req.params.userId);
        res.send(categories);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

categoryRouter.get('/:categoryId', async (req: Request<ParamsDictionary, Category>, res) => {
    try {
        const category = await db.getCategory(req.params.categoryId);
        res.send(category);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

categoryRouter.put('/:categoryId', async (req: Request<ParamsDictionary, Category, Category>, res) => {
    try {
        const category = await db.editCategory({
            ...req.body,
            user_id: req.params.userId,
        });
        res.send(category);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

categoryRouter.delete('/:categoryId', async (req: Request<ParamsDictionary>, res) => {
    try {
        await db.deleteCategory(req.params.categoryId);
        res.sendStatus(204);
    } catch (error) {
        res.send(error.message).status(500);
    }
});

export { categoryRouter };
