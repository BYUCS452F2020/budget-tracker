import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import { DatabaseFactory } from './database/database-factory';
import { IncomeModel, UserModel } from './database/mongo/MongoDatabase';
import { categoryRouter } from './routes/category.routes';
import { expenseRouter } from './routes/expense.routes';
import { incomeRouter } from './routes/income.routes';
import { userRouter } from './routes/user.routes';

export type ParamsDictionary = { [key: string]: string };
const port = 3001;

async function setup() {
    // loads the vars in ./.env file
    dotenv.config();

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.use('/users/:userId/categories/:categoryId/expenses', expenseRouter);
    app.use('/users/:userId/categories', categoryRouter);
    app.use('/users/:userId/incomes', incomeRouter);
    app.use('/users', userRouter);

    await DatabaseFactory.getDatabase().init();

    // example of creating a user
    const user = await UserModel.create({
        email: 'nate',
        first_name: 'Nate',
        passwd: 'hello',
        unallocated_funds: 10,
    });

    // example of creating an income with a user (could also use the user's id instead of object directly)
    await IncomeModel.create({
        income_date: Date(),
        amount: 20,
        summary: 'my summary',
        user: user,
    });

    // example of finding an income by user (could also use user's object id)
    const income = await IncomeModel.findOne({ user: user });

    // populate actually adds the user object to the user field instead of just an id
    // make sure to run execPopulate();
    await income.populate('user').execPopulate();

    console.log('found income', income);

    return app;
}

setup().then((app) => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
});
