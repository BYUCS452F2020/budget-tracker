/*
  These are template SQL statements with dummy data for each of the user routes
 */


/*
 To insert a new user
 for POST - create user
 */
INSERT INTO users (email, first_name, last_name, passwd)
VALUES ('budget_tracker@gmail.com', 'Justin', 'Strommen', 'badPassword');

/*
 To get a user's information by providing their id
 for GET - get user
 */
SELECT *
FROM users
WHERE user_id = 1;

/*
 To overwrite a specific user's information
 for PUT - edit user
 */
UPDATE users
SET email      = 'newEmail@gmail.com',
    first_name = 'John',
    last_name  = 'Doe',
    passwd     = 'myPassword'
WHERE user_id = 1;

/*
 To delete a specific user and cascade on the rest of their information
 for DELETE - delete user
 */
DELETE
FROM users
WHERE user_id = 1;

/*
 To list all expenses for the specified user.
 for GET - get expenses
 */
SELECT expenses.summary,
       round(expenses.amount::numeric, 2)   AS amount_spent,
       expenses.expense_date,
       categories.category_name,
       round(categories.amount::numeric, 2) AS Total_Category_Amount
FROM expenses
         JOIN categories ON expenses.category_id = categories.category_id
WHERE categories.user_id = 1;

/*
 To login a specified user
 for POST - login user
 */
SELECT users.user_id,
       CONCAT(users.first_name, ' ', users.last_name) AS full_name,
       users.email,
       users.unallocated_funds
FROM users
WHERE users.email = 'budget_tracker@gmail.com'
  AND users.passwd = 'badPassword';
