/*
  These are template SQL statements with dummy data for each of the expense routes
 */


/*
 To insert a new expense
 for POST - create expense
 */
INSERT INTO expenses (category_id, amount, expense_date, summary)
VALUES (2, 750.09, '12/12/2020', 'Paid December Rent');

/*
 To get all expenses for a specific user and category.
 for GET - get expenses
 */
SELECT *
FROM expenses
WHERE category_id = 1;

/*
 To overwrite a specific expense's information
 for PUT - edit expense
 */
UPDATE expenses
SET category_id  = 2,
    amount       = 74.99,
    expense_date = '10/31/2020',
    summary      = 'Did Halloween shopping'
WHERE category_id = 1
  AND expense_id = 7;

/*
 To delete a specific expense
 for DELETE - delete expense
 */
DELETE
FROM expenses
WHERE expense_id = 7;
