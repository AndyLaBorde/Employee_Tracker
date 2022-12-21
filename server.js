// Import the connection object
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cfonts = require('cfonts');
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
const showTitle = () => {

    const prettyFont = cfonts.render('Employee|Tracker', {  
        font: 'chrome',              // define the font face
        align: 'center',              // define text alignment
        colors: ['system'],         // define all colors
        background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
        letterSpacing: 1,           // define letter spacing
        lineHeight: 1,              // define the line height
        space: true,                // define if the output text should have empty lines on top and on the bottom
        maxLength: '0',             // define how many character can be on one line;
    
    })
    prettyFont.string  // the ansi string for sexy console font
    prettyFont.array   // returns the array for the output
    prettyFont.lines   // returns the lines used
    prettyFont.options // returns the options used
}
// prompts options choice
const initialPrompt = () => {
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
        if (Response.choice === "View all roles") { showRoles(); }
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
            initialPrompt();
        }
    );
}
function showDepartments() {
    db.query(
        "SELECT * FROM department", (err, results) => {
            console.table(results);
            initialPrompt();
        }
    )
}
function showRoles() {
    db.query(
        "SELECT * FROM role", (err, results) => {
            console.table(results);
            initialPrompt();
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
            initialPrompt();
        })

    })
}
function addEmployee() {
    db.query("SELECT * FROM role", (err, results) => {
    
        const roles = results.map((role) => {
            return {
                name: role.title,
                value: role.id
            }
        })
        db.query("SELECT * FROM employee", (err, results) => {
                const manager = results.map((employee) => {
                    return {
                        name: employee.first_name + " " + employee.last_name,
                        value: employee.role_id,
                    }
                })
        inquirer.prompt([
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
            choices: roles,
            name: "role"
        },
        {
            type: "confirm", 
            message: "Does this employee have a manager?",
            name: "managerConfirm"
        },
        {
            type: "list",
            message: "Who is this employees manager?",
            choices: manager,
            when(data) {
                return data.managerConfirm;
            },
            name: "employeeManager",
        },
    ])
        .then((results) => {
            db.query(
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [results.firstName, results.lastName, results.role, results.employeeManager],
                (err, results) => {
                    console.log(results);
                    initialPrompt();
                })
            })
        })
    })    
}
function addRole() {
    // creates an active log to be able to be selecting from all departments including any added
    
    let currentDepartments = []
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
        })
        initialPrompt();
    })
}
showTitle();
initialPrompt();


