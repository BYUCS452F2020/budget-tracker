/*
  These are template SQL statements with dummy data for each of the category routes
 */


/*
 To insert a new category
 for POST - create category
 */
INSERT INTO categories (user_id, category_name, amount, monthly_default)
VALUES (1, 'Rent', 800.00, 600.00);

/*
 To get all categories for the specified user.
 for GET - get categories
 */
SELECT category_name, amount, monthly_default
FROM categories
WHERE categories.user_id = 1;

/*
 To get a single specified category
 for GET - get category
 */
SELECT *
FROM categories
WHERE category_id = 1;

/*
 To overwrite a specific category's information
 for PUT - edit category
 */
UPDATE categories
SET category_name   = 'I renamed this category',
    amount          = 50,
    monthly_default = 60
WHERE category_id = 2;

/*
 To delete a specific category and cascade on its expenses.
 for DELETE - delete category
 */
DELETE
FROM categories
WHERE user_id = 1
  AND category_id = 2;
