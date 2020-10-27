-- Create the database

CREATE DATABASE budget_tracker;

-- Make sure to connect to db before proceeding!!!
-- if using psql on command line, do following cmd:
-- \c budget_tracker


-- Create the tables
CREATE TABLE IF NOT EXISTS users(
	user_id	          SERIAL	          NOT NULL  PRIMARY KEY,
	email	            VARCHAR(30)       NOT NULL  UNIQUE,
	first_name	      VARCHAR(30)       NOT NULL,
	last_name	        VARCHAR(30)       NOT NULL,
	passwd	          VARCHAR(30)       NOT NULL,
	unallocated_funds DOUBLE PRECISION  NOT NULL	DEFAULT 0
);

CREATE TABLE IF NOT EXISTS incomes(
	income_id         SERIAL	          NOT NULL  PRIMARY KEY,
	user_id	          INTEGER           NOT NULL,
	amount            DOUBLE PRECISION  NOT NULL,
	income_date       DATE 	            NOT NULL,
	summary           VARCHAR(100),

  FOREIGN KEY(user_id) 
  REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories(
	category_id       SERIAL	          NOT NULL  PRIMARY KEY,
	user_id           INTEGER	          NOT NULL,
	category_name     VARCHAR(30)       NOT NULL,
	amount            DOUBLE PRECISION  NOT NULL,
	monthly_default   DOUBLE PRECISION,

  FOREIGN KEY(user_id) 
  REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expenses(
	expense_id        SERIAL	          NOT NULL  PRIMARY KEY,
	category_id       INTEGER	          NOT NULL,
	amount            DOUBLE PRECISION  NOT NULL,
	expense_date      DATE 	            NOT NULL,
	summary           VARCHAR(100),

  FOREIGN KEY(category_id) 
  REFERENCES categories(category_id) ON DELETE CASCADE
);
