-- CREATE TABLE products (
--     product_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

--     product_name text NOT NULL,

--     price numeric(8,2) NOT NULL CHECK (price > 0),

--     category_id integer,

--     stock_quantity integer NOT NULL DEFAULT 0
-- );


-- CREATE TABLE orders (
--     order_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

--     product_id integer,

--     quantity integer NOT NULL CHECK (quantity > 0),

--     order_date date NOT NULL DEFAULT CURRENT_DATE
-- );



-- INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES ('Wireless Mouse', 19.99, (SELECT category_id FROM categories WHERE category_name = 'Electronics'), 150);

-- INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES ('Mechanical Keyboard', 49.99, (SELECT category_id FROM categories WHERE category_name = 'Electronics'), 80);

-- INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES ('Standing Desk', 249, (SELECT category_id FROM categories WHERE category_name = 'Furniture'), 30);

-- INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES ('Office Chair', 129.50, (SELECT category_id FROM categories WHERE category_name = 'Furniture'), 45);

-- INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES ('Notebook Pack', 4.99, (SELECT category_id FROM categories WHERE category_name = 'Stationery'), 300);

-- INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES ('Gel Pens (12-pack)', 6.50, (SELECT category_id FROM categories WHERE category_name = 'Stationery'), 220);

-- INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES ('PostgreSQL Handbook', 39, (SELECT category_id FROM categories WHERE category_name = 'Books'), 60);

-- INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES ('SQL Cookbook', 34, (SELECT category_id FROM categories WHERE category_name = 'Book'), 40);

-- INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES ('Building Blocks', 24.99, (SELECT category_id FROM categories WHERE category_name = 'Toys & Games'), 60);

-- INSERT INTO products (product_name, price, category_id, stock_quantity) VALUES ('Desk Lamp', 15.50, NULL, 0);




-- INSERT INTO orders (product_id, quantity, order_date) VALUES ((SELECT product_id FROM products WHERE product_name = 'Wireless Mouse'), 2, '2026-01-05');

-- INSERT INTO orders (product_id, quantity, order_date) VALUES ((SELECT product_id FROM products WHERE product_name = 'Wireless Mouse'), 1, '2026-01-12');

-- INSERT INTO orders (product_id, quantity, order_date) VALUES ((SELECT product_id FROM products WHERE product_name = 'Mechanical Keyboard'), 1, '2026-01-12');

-- INSERT INTO orders (product_id, quantity, order_date) VALUES ((SELECT product_id FROM products WHERE product_name = 'Standing Desk'), 1, '2026-01-20');

-- INSERT INTO orders (product_id, quantity, order_date) VALUES ((SELECT product_id FROM products WHERE product_name = 'Office Chair'), 2, '2026-01-22');

-- INSERT INTO orders (product_id, quantity, order_date) VALUES ((SELECT product_id FROM products WHERE product_name = 'Notebook Pack'), 5, '2026-02-01');

-- INSERT INTO orders (product_id, quantity, order_date) VALUES ((SELECT product_id FROM products WHERE product_name = 'Gel Pens (12-pack)'), 3, '2026-02-01');

-- INSERT INTO orders (product_id, quantity, order_date) VALUES ((SELECT product_id FROM products WHERE product_name = 'PostgreSQL Handbook'), 1, '2026-02-10');

-- INSERT INTO orders (product_id, quantity, order_date) VALUES ((SELECT product_id FROM products WHERE product_name = 'Wireless Mouse'), 3, '2026-02-15');

-- INSERT INTO orders (product_id, quantity, order_date) VALUES ((SELECT product_id FROM products WHERE product_name = 'Gel Pens (12-pack)'), 2, '2026-02-18');




-- SELECT p.product_name, p.price, c.category_name FROM products p

-- INNER JOIN categories c ON p.category_id = c.category_id;




-- SELECT p.product_name, p.price, c.category_name FROM products p 

-- LEFT JOIN categories c ON p.category_id = c.category_id;



-- SELECT p.product_name, o.quantity FROM products p

-- LEFT JOIN orders o ON p.product_id = o.product_id;