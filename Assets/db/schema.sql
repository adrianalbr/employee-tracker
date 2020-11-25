DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;

CREATE TABLE department(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  name VARCHAR(70) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  PRIMARY KEY (id),
FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

Select * from department;
Select * from role;
select * from employee;

-- View all employees
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager
FROM employee
LEFT JOIN employee as e2 ON e2.id = employee.manager_id
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
ORDER BY employee.id;
 
-- View all employees by department
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager
FROM employee
LEFT JOIN employee as e2 ON e2.id = employee.manager_id
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
WHERE department.name = 'Magical Law Enforcement'
ORDER BY employee.id;


-- All Managers
SELECT DISTINCT e2.first_name, e2.last_name
FROM employee
LEFT JOIN employee AS e2 ON employee.manager_id = e2.id
WHERE e2.first_name IS NOT NULL;

-- View all employees by Manager
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager
FROM employee
LEFT JOIN employee AS e2 ON e2.id = employee.manager_id
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
WHERE e2.first_name = 'Amelia'
ORDER BY employee.id;




