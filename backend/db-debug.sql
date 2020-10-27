/*
 For useful SQL commands that won't directly be used in our app.
 */

-- Insert a single dummy user with some dummy data
-- note that this overwrites the auto-incrementing id(s) to make debugging easier
INSERT INTO users (user_id, email, first_name, last_name, passwd)
VALUES (1, 'budget_tracker@gmail.com', 'Justin', 'Strommen', 'badPassword');
INSERT INTO incomes (user_id, amount, income_date, summary)
VALUES (1, 375.69, '12/31/2020', 'Last paycheck of the year');
INSERT INTO categories (category_id, user_id, category_name, amount, monthly_default)
VALUES (1, 1, 'Rent', 800.00, 600.00);
INSERT INTO categories (category_id, user_id, category_name, amount, monthly_default)
VALUES (2, 1, 'Groceries', 400.00, null);
INSERT INTO expenses (expense_id, category_id, amount, expense_date, summary)
VALUES (7, 1, 750.09, '12/12/2020', 'Paid December Rent');
INSERT INTO expenses (category_id, amount, expense_date, summary)
VALUES (2, 80.09, '01/28/2020', 'Weekly shopping trip');
INSERT INTO expenses (category_id, amount, expense_date, summary)
VALUES (2, 5.00, '01/29/2020', 'Forgot something');

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
