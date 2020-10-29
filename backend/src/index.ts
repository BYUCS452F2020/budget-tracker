import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import { categoryRouter } from './routes/category.routes';
import { expenseRouter } from './routes/expense.routes';
import { incomeRouter } from './routes/income.routes';
import { userRouter } from './routes/user.routes';

export type ParamsDictionary = { [key: string]: string };

// loads the vars in ./.env file
dotenv.config();

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/users/:userId/categories/:categoryId/expenses', expenseRouter);
app.use('/users/:userId/categories', categoryRouter);
app.use('/users/:userId/incomes', incomeRouter);
app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
