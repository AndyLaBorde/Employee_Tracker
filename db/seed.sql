INSERT INTO department (name)
VALUES 
("Engineering"),
("Finance"),
("Legal"),
("Sales");

INSERT INTO role(title, salary, department_id)
VALUES
("Sales Lead", "100000", 4),
("Salesperson", "80000", 4),
("Lead Engineer", "150000", 1),
("Software Engineer", "120000", 1),
("Account Manager", "160000", 2),
("Accountant", "125000", 2),
("Legal Team Leader", "250000", 3),
("Lawyer", "190000", 3),
("Sales Lead", "100000", 4);

INSERT INTO employee(first_name, last_name, manager_id,role_id)
VALUES
("Norris", "Chuck", null, 1),
("Wayne", "Bruce", 1, 2),
("Kent", "Clark", null , 3),
("Grinch", "Mr.", null, 4),
("Lou Who", "Betty", 7, 8),
("Claws", "Sandy", null, 5),
("Skellington", "Jack", 5, 6),
("The Elf", "Buddy", null, 7),
("Griswald", "Clark", null, 9);