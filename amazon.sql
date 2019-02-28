DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR (30) NOT NULL,
  price INTEGER(10) NOT NULL,
  stock_quantity INTEGER(10) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dior Cherie", "Perfume", 125, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Spider Plant", "Gardening", 15, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ball", "Toys", 10, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chalk", "Toys", 3, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Barbie", "Toys", 20, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Yoga Pant", "Clothing", 40, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bread", "Bakery", 5, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tweezer", "Beauty", 10, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Yoga Mat", "Exercise", 25, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Orange Juice", "Grocery", 5, 20);