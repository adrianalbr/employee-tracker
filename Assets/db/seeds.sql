USE employeeTracker_db;
INSERT INTO department (name) values ('Improper Use of Magic');
INSERT INTO department (name) values ('Magical Games and Sports');
INSERT INTO department (name) values ('Magical Law Enforcement');
INSERT INTO department (name) values ('Magical Mysteries');
INSERT INTO department (name) values ( 'Magical Transportation');
INSERT INTO department (name) values ('Misuse of Muggle Artefacts');
INSERT INTO department (name) values ('Regulation and Control of Magical Creatures');
INSERT INTO department (name) values ('Magical Cooperation');

INSERT INTO role (title, salary, department_id) values ('Manager', 120000, 1);
INSERT INTO role (title, salary, department_id) values ('Supervisor', 75000, 8);
INSERT INTO role (title, salary, department_id) values ('Head of Dept', 100000, 2);
INSERT INTO role (title, salary, department_id) values ('Officer', 80000, 2);
INSERT INTO role (title, salary, department_id) values ('Manager', 130000, 3);
INSERT INTO role (title, salary, department_id) values ('Auror', 110000, 3);
INSERT INTO role (title, salary, department_id) values ('Unspeakable', 150000, 4);
INSERT INTO role (title, salary, department_id) values ('Officer', 85000, 5);
INSERT INTO role (title, salary, department_id) values ('Coordinator', 120000, 6);
INSERT INTO role (title, salary, department_id) values ('Admin2', 80000, 6);
INSERT INTO role (title, salary, department_id) values ('Admin3', 80000, 7);


INSERT INTO employee (first_name, last_name, role_id) values ('Mafalda', 'Hopkirk', 2);
INSERT INTO employee (first_name, last_name, role_id) values ('Bartemius', 'Crouch', 3);
INSERT INTO employee (first_name, last_name, role_id) values ('Ludovic', 'Bagman', 4);
INSERT INTO employee (first_name, last_name, role_id) values ('Bertha', 'Jorkins', 5);
INSERT INTO employee (first_name, last_name, role_id) values ('Amelia', 'Bones', 6);
INSERT INTO employee (first_name, last_name, role_id) values ('Harry', 'Potter', 7);
INSERT INTO employee (first_name, last_name, role_id) values ('John', 'Dawlish', 7);
INSERT INTO employee (first_name, last_name, role_id) values ('Nymphadora', 'Tonks', 7);
INSERT INTO employee (first_name, last_name, role_id) values ('Broderick', 'Bode', 8);
INSERT INTO employee (first_name, last_name, role_id) values ('Percy', 'Weasley', 9);
INSERT INTO employee (first_name, last_name, role_id) values ('Arthur', 'Weasley', 10);
INSERT INTO employee (first_name, last_name, role_id) values ('Bob', 'Perkins', 11);
INSERT INTO employee (first_name, last_name, role_id) values ('Newt', 'Scamander', 12);

