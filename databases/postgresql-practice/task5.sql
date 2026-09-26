-- SELECT c.category_name, SUM (o.quantity * p.price) AS total_revenue FROM orders o

-- INNER JOIN products p ON o.product_id = p.product_id

-- INNER JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name;


-- SELECT p.product_name, COUNT(o.order_id) AS order_count FROM products p 

-- LEFT JOIN orders o ON p.product_id = o.product_id GROUP BY p.product_id, p.product_name ORDER BY p.product_id;





-- SELECT c.category_name, SUM(o.quantity * p.price) AS total_revenue FROM orders o

-- INNER JOIN products p ON o.product_id = p.product_id

-- INNER JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name HAVING SUM(o.quantity * p.price) > 100;