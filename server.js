// Import the connection object
const inquirer = require("inquirer");
const mysql = require("mysql2");
// custom module
require('dotenv').config();



// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: process.env.DB_USER,
        // MySQL password
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    console.log(`Connected to the employeeTracker_ database.`)
);
// prompts options choice
const initalPrompt = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all employees",
                "View all roles",
                "Add a department",
                "Add an Employee",
                "Add a role",
                "Update an employee",
                "Quit"
            ],
            name: "choice",
        }
    ]).then((Response) => {
        if (Response.choice === "View all departments") { showDepartments(); }
        if (Response.choice === "View all employees") { showEmployees(); }
        if (Response.choice === "View all Roles") { showRoles(); }
        if (Response.choice === "Add a department") { addDepartment(); }
        if (Response.choice === "Add an Employee") { addEmployee(); }
        if (Response.choice === "Add a role") { addRole(); }
        if (Response.choice === "Update an employee") { updateEmployeeRole(); }
    })
}
function showEmployees() {
    db.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, employee.manager_id  FROM((employee JOIN role ON employee.role_id = role.id) JOIN department ON department.id = role.department_id) ",
        (err, results) => {
            console.table(results);
            initalPrompt();
        }
    );
}
function showDepartments() {
    db.query(
        "SELECT * FROM department", (err, results) => {
            console.table(results);
            initalPrompt();
        }
    )
}
function showRoles() {
    db.query(
        "SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id,", (err, results) => {
            console.table(results);
            initalPrompt();
        }
    )
}
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "departmentName"
        }
    ]).then((results) => {
        db.query("INSERT INTO department (name) VALUES (?)", [results.departmentName], function (err, results) {
            console.log(results);
            initalPrompt();
        })

    })
}
function addEmployee() {
    currentRoles = [];
    db.query("SELECT * FROM role", (err, results) => {
        console.log(results);
        for (i = 0; i < results.length; i++) {
            currentRoles.push(results[i].title);
        }
    })
    const addingEmployeeQuestions = [
        {
            type: "input",
            message: "What is the Employees first name?",
            name: "firstName",
        },
        {
            type: "input",
            message: "What is the Employees last name?",
            name: "LastName",
        },
        {
            type: "list",
            message: "What is the employee's role?",
            choices: currentRoles,
            name: "role"
        },
        {
            type: "input",
            message: "Select a manager ID, enter 0 for no manager",
            name: "Manager",
        },
    ];

    inquirer.prompt(addingEmployeeQuestions).then((results) => {
        let roleId = 0;
        for (i = 0; i < results.length; i++) {
            if (results.role == results[i].title) {
                roleId = results[i].department_id;
            }
        }

        let manager = 0;

        if (results.Manager == 0) {
            manager = null;
        } else {
            manager = results.Manager;
        }

        db.query(
            "INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)", [results.firstName, results.lastName, results.manager, results.roleId],
            (err, results) => {
                console.log(results);
                initalPrompt();
            })
    })
}
function addRole() {
    // creates an active log to be able to be selecting from all departments including any added
    currentDepartments = [];
    db.query("SELECT * FROM department", (err, results) => {
        // console.log(results);
        for (i = 0; i < results.length; i++) {
            currentDepartments.push(results[i].name)
        }
    })
    inquirer.prompt([
        {
            type: "input",
            message: "What is the role?",
            name: "title"
        },
        {
            type: "input",
            message: "What is the salary of this role?",
            name: "salary"
        },
        {
            type: "list",
            message: "Which department does this role belong to?",
            choices: currentDepartments,
            name: "department"
        }
    ]).then((results) => {
        let department_id = 0;
        for (i = 0; i < results.length; i++) {
            if (results.department == results[i].name) {
                department_id = results[i].id;
            }
        }
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [results.title, results.salary, results.department_id], (err, results) => {
            console.log(results);
            initalPrompt();
        })
    })
}

initialPrompt();