/*
  These are template SQL statements with dummy data for each of the income routes
 */

/*
 To insert a new income
 for POST - create income
 */
INSERT INTO incomes (user_id, amount, income_date, summary)
VALUES (1, 375.69, '12/31/2020', 'Last paycheck of the year');

/*
To get all incomes of a user
for GET - get incomes
*/
SELECT *
FROM incomes
WHERE user_id = 1;

/*
To modify a previously inserted income
for PUT - edit incomes
*/
UPDATE incomes
SET amount = '123456789',
    income_date = '12/31/2020',
    description = 'Last Paycheck'
WHERE income_id = 1
  AND user_id = 2;

/*
To delete an income entry
for DELETE - delete income
*/
DELETE
FROM incomes
WHERE income_id = 1
  AND user_id = 2;