/*
 For useful SQL commands that won't directly be used in our app.
 */

-- Insert a single dummy user with some dummy data
-- note that this overwrites the auto-incrementing id(s) to make debugging easier
INSERT INTO users (user_id, email, first_name, last_name, passwd)
VALUES (1, 'email1@gmail.com', 'Justin', 'Strommen', 'pass1');

INSERT INTO incomes (income_id, user_id, amount, income_date, summary)
VALUES (1, 1, 375.69, '12/15/2020', 'Paycheck 1');

INSERT INTO incomes (income_id, user_id, amount, income_date, summary)
VALUES (2, 1, 400.25, '12/31/2020', 'Paycheck 2');

INSERT INTO categories (category_id, user_id, category_name, amount, monthly_default)
VALUES (1, 1, 'Rent', 800.00, 600.00);

INSERT INTO categories (category_id, user_id, category_name, amount, monthly_default)
VALUES (2, 1, 'Groceries', 400.00, null);

INSERT INTO expenses (expense_id, category_id, amount, expense_date, summary)
VALUES (1, 1, 750.09, '12/12/2020', 'Paid December Rent');

INSERT INTO expenses (expense_id, category_id, amount, expense_date, summary)
VALUES (2, 2, 80.09, '01/28/2020', 'Weekly shopping trip');

INSERT INTO expenses (expense_id, category_id, amount, expense_date, summary)
VALUES (3, 2, 5.00, '01/29/2020', 'Forgot something');






INSERT INTO users (user_id, email, first_name, last_name, passwd)
VALUES (2, 'email2@gmail.com', 'Nate', 'Barlow', 'pass2');

INSERT INTO incomes (income_id, user_id, amount, income_date, summary)
VALUES (3, 2, 200, '12/1/2020', 'Bonus');

INSERT INTO incomes (income_id, user_id, amount, income_date, summary)
VALUES (4, 2, 350.99, '12/16/2020', 'Salary');

INSERT INTO categories (category_id, user_id, category_name, amount, monthly_default)
VALUES (3, 2, 'Personal', 10, null);

INSERT INTO categories (category_id, user_id, category_name, amount, monthly_default)
VALUES (4, 2, 'Netflix', 10, 10);

INSERT INTO expenses (expense_id, category_id, amount, expense_date, summary)
VALUES (4, 3, 13, '12/12/2020', 'Cafe Rio Food');

INSERT INTO expenses (expense_id, category_id, amount, expense_date, summary)
VALUES (5, 3, 80.09, '01/28/2020', 'Personal clothes');

INSERT INTO expenses (expense_id, category_id, amount, expense_date, summary)
VALUES (6, 4, 10.00, '01/29/2020', 'netflix');





INSERT INTO users (user_id, email, first_name, last_name, passwd)
VALUES (3, 'email3@gmail.com', 'Josh', 'Shirley', 'pass3');

INSERT INTO categories (category_id, user_id, category_name, amount, monthly_default)
VALUES (5, 3, 'Auto', 300, 175);

INSERT INTO categories (category_id, user_id, category_name, amount, monthly_default)
VALUES (6, 3, 'Amazon', 26, null);

INSERT INTO expenses (expense_id, category_id, amount, expense_date, summary)
VALUES (7, 5, 110.55, '12/12/2020', 'Car insurance');

INSERT INTO expenses (expense_id, category_id, amount, expense_date, summary)
VALUES (8, 5, 22.30, '01/28/2020', 'Gas');

INSERT INTO expenses (expense_id, category_id, amount, expense_date, summary)
VALUES (9, 6, 10.50, '01/29/2020', 'Prime membership');




-- Delete that dummy user and cascade on everything else that came with it
DELETE
FROM users
WHERE user_id = 1;

-- List all entries of all tables
SELECT *
FROM categories;
SELECT *
FROM expenses;
SELECT *
FROM incomes;
SELECT *
FROM users;
