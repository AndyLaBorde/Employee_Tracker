const inquirer = require("inquirer");
const mysql = require("mysql2");

const consoleTable = require("console.table");
const fs = require("fs");
const Connection = require("mysql2/typings/mysql/lib/Connection");

//makes a query and returns back employee table
function showEmployees() {
    db.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, employee.manager_id  FROM((employee JOIN role ON employee.role_id = role.id) JOIN department ON department.id = role.department_id) ",
        (err, results) => {
            console.table(results);
            showPrompts();
        }
    );
}
//makes a query and returns back roles table
function showRoles() {
    db.query(
        "SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id",
        (err, results) => {
            console.table(results);
            showPrompts();
        }
    );
}
// make query to view all departments
function showDepartments() {
    db.query(
        "SELECT * FROM department", (err, results) => {
            console.table(results);
            showPrompts();
        }
    )
}

init();

module.exports = sequelize;