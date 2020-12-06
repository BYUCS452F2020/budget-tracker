import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import {DatabaseFactory} from './database/database-factory';
import {CategoryModel, ExpenseModel, IncomeModel, UserModel} from './database/mongo/MongoDatabase';
import {categoryRouter} from './routes/category.routes';
import {expenseRouter} from './routes/expense.routes';
import {incomeRouter} from './routes/income.routes';
import {userRouter} from './routes/user.routes';
import mongoose from "mongoose";

export type ParamsDictionary = { [key: string]: string };
const port = 3001;

async function setup() {
    // loads the vars in ./.env file
    dotenv.config();

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        } else {
            return next();
        }
    });

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
        last_name: 'NateLast',
        passwd: 'hello',
        unallocated_funds: 10,
    });

    // example of creating an income with a user (could also use the user's id instead of object directly)
    await IncomeModel.create({
        income_date: Date(),
        amount: 20,
        summary: 'my summary1',
        user: user,
    });

    // example of creating a category with a user
    const category = await CategoryModel.create( {
        category_name: 'myCategory',
        amount: 120,
        monthly_default: 200,
        user: user,
    });

    // example of creating an expense with a category
    await ExpenseModel.create( {
        expense_date: Date(),
        amount: 5,
        summary: "testSummary",
        category: category,
    });

    // example of finding an income by user (could also use user's object id)
    const income = await IncomeModel.findOne({user: user});
    const income2 = await IncomeModel.find({user: user._id});

    // populate actually adds the user object to the user field instead of just an id
    // make sure to run execPopulate();

    // await income.populate('user').execPopulate(); //fixme
    // await income2[0].populate('user').execPopulate(); //fixme

    console.log('found income', income);
    console.log('found income2', income2);

    return app;
}

setup().then((app) => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
});
