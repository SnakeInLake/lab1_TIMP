-- schema.sql

DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  details TEXT
);

-- Начальные данные
INSERT INTO employees (name, position, details) VALUES
  ('John Doe', 'Manager'),
  ('Jane Smith', 'Developer', 'bebebe'),
  ('Bob Johnson', 'Designer', 'aaaaa');