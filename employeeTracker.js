const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "GTboot001",
  database: "employeeTracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  
  init();
});

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Welcome to the Ministry of Magic Employee Tracker! What you like to do?",
        name: "search",
        choices: [
          "View all employees",
          "View all employees by Department",
          "View all employees by Manager",
          "Add a new employee",
          "Remove and employee",
          "Update employee role",
          "Update employee manager",
          "Exit",
        ],
      },
    ])
    .then(({ search }) => {
      switch (search) {
        case "View all employees":
          allEmployees();
          break;
        case "View employees by department":
          employeesBydepartment();
          break;
        case "View employees by Manager":
            employeesBymanager();
          break;
        case "Exit":
          exit();
          break;
        default:
          console.log("You have entered an invalid command, please try again");
      }
    });
}

//FUNCTIONS
//View all employees

function allEmployees() {
      connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id",
        (err, data) => {
          if (err) throw err;
          console.table(data);
          init();
        }
      );
    };

function employeesBydepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What Department would you like to see?",
        name: "title",
      },
    ])
    .then(({ department }) => {
      connection.query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = ? ORDER BY employee.id;"
        [department],
        (err, data) => {
          if (err) throw err;
          console.table(data);
          init();
        }
      );
    });
}

function employeesBymanager() {
  // All distinct managers from employee table
  connection.query("SELECT DISTINCT e2.first_name, e2.last_name FROM employee LEFT JOIN employee AS e2 ON employee.manager_id = e2.id WHERE e2.first_name IS NOT NULL",
function (err, results) {
    if (err) throw err;
    inquirer
        .prompt([
            {
                name: "manager",
                type: "list",
                choices: function () {
                    let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].first_name);
                    }
                    return choiceArray;
                },
                message: "Which magical manager would you like to search by?"
            }
        ])
        .then(function (answer) {
            console.log(answer.manager);
            let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee AS e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE e2.first_name = ? ORDER BY employee.id;'
            connection.query(query, answer.manager, function (err, res) {
                if (err) throw err;
                console.table(res);
                init();
            });
        });
});
}


function exit() {
  connection.end();
}