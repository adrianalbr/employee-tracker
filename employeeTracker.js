const mysql = require("mysql");
const inquirer = require("inquirer")
const figlet = require("figlet");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "GTboot001",
  database: "employeeTracker_db",
});

figlet('Ministry of Magic CMS', function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  console.log(data)
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
        message:
          "Welcome to the Ministry of Magic Employee Tracker! What you like to do?",
        name: "search",
        choices: [
          "View all employees",
          "View all employees by Department",
          "View all employees by Manager",
          "Add a new employee",
          "Remove employee",
          "Update employee role",
          "Update employee manager",
          "exit",
        ],
      },
    ])
    .then(({ search }) => {
      switch (search) {
        case "View all employees":
          allEmployees();
          break;
        case "View all employees by Department":
          byDepartment();
          break;
        case "View all employees by Manager":
          byManager();
          break;
          case "Add a new employee":
          addEmployee();
          break;
          case "Remove employee":
          removeEmployee();
          break;
          case "Update employee role":
          updateRole();
          break;
          case "Update employee manager":
          updateManager();
          break;
        case "exit":
          exit();
          break;
        default:
          console.log("You have selected an invalid option, please try again");
          init();
      }
    });
}

//FUNCTIONS

//View all employees

function allEmployees() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id",
    function (err, data) {
      if (err) throw err;
      console.table(data);
      init();
    }
  );
}

// View all employees by department
function byDepartment() {
  //show all available departments
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          choices: function () {
            let choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].name);
            }
            return choiceArray;
          },
          message: "What department would you like to search by",
        },
      ])
      .then(({ department }) => {
        console.log(department);
        connection.query(
          `
        SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager
        FROM employee
        LEFT JOIN employee as e2 ON e2.id = employee.manager_id
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE department.name = ?
        ORDER BY employee.id;
        `,
          [department],
          (err, data) => {
            if (err) throw err;
            console.table(data);
            init();
          }
        );
      });
  });
}

//View all employees by Manager
function byManager() {
  // All distinct managers from employee table
  connection.query(
    "SELECT DISTINCT e2.first_name, e2.last_name FROM employee LEFT JOIN employee AS e2 ON employee.manager_id = e2.id WHERE e2.first_name IS NOT NULL",
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
            message: "Which magical manager would you like to search by?",
          },
        ])
        .then(function (answer) {
          console.log(answer.manager);
          let query =
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee AS e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE e2.first_name = ? ORDER BY employee.id;";
          connection.query(query, answer.manager, function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
          });
        });
    }
  );
};

// Add an employee
function addEmployee() {
  let newEmployee = {};
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the employee's first name?",
          validate: function (answer) {
            if (answer.length <1) {
              return console.log("valid name required");
            }
            return true;
          }
        },

        {
          name: "last_name",
          type: "input",
          message: "What is the employee's last name?",
          validate: function (answer) {
            if (answer.length <1) {
              return console.log("valid last name required");
            }
            return true;
          }
        },

        {
          name: "role",
          type: "list",
          choices: function () {
            let choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].title);
            }
            return choiceArray;
          },
          message: "What is the employee's role?",
        }
      ])
      .then(function (answer) {
        newEmployee.first_name = answer.first_name;
        newEmployee.last_name = answer.last_name;

        //role to role id
        connection.query("Select * FROM role WHERE title = ?", answer.role, function (err, results) {
          if (err) throw err;
          newEmployee.role_id = results[0].id;

          //what manager
          connection.query("SELECT * FROM employee;", function (err, results) {
            if (err) throw err;
            inquirer
            .prompt([
              {
                name: "manager_name",
                type: "list",
                choices: function () {
                  let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                      choiceArray.push(results[i].first_name);
                      }
                    return choiceArray;
                    },
                  message: "Who is the employee's manager?"
                  }
            ])
            .then(function (answer) {
              connection.query("SELECT id FROM employee WHERE first_name = ?", answer.manager_name, function (err, results) {
                if (err) throw err;
                newEmployee.manager_id = results[0].id;
                console.log ("Adding new employee: ", newEmployee);

                connection.query("INSERT INTO employee SET ?", newEmployee, function (err, results) {
                  if (err) throw err;
                  console.log("Employee has been added");
                  init();
                })
              })
            })
          })
        })
      })
  })};

// Remove an employee
function removeEmployee() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "removeEmployee",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to vanish?"
                }
            ])
            .then(function (answer) {
                let query = 'DELETE FROM employee WHERE first_name = ?;'
                connection.query(query, answer.removeEmployee, function (err, res) {
                    if (err) throw err;
                    console.log("Employee successfully vanished");
                    init();
                });
            });
    });
};

//Update specific employee role

function updateRole() {
  let newRole = {};
  connection.query(
    `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager
    FROM employee
    LEFT JOIN employee AS e2 ON e2.id = employee.manager_id
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    ORDER BY employee.id;
    ` ,
    function (err, results) {
      if (err) throw err;
      inquirer
          .prompt([
              {
                  name: "updateEmployee",
                  type: "list",
                  choices: function () {
                      let choiceArray = [];
                      for (var i = 0; i < results.length; i++) {
                          choiceArray.push(results[i].first_name);
                      }
                      return choiceArray;
                  },
                  message: "Which employee would you like to update?"
              }
          ])
          .then(function (answer) {
              newRole.first_name = answer.updateEmployee;
              connection.query("SELECT * FROM role", function (err, res) {
                  if (err) throw err;
                  inquirer
                      .prompt([
                          {
                              name: "updateRole",
                              type: "list",
                              choices: function () {
                                  let choiceArray = [];
                                  for (var i = 0; i < results.length; i++) {
                                      choiceArray.push(results[i].title);
                                  }
                                  return choiceArray;
                              },
                              message: "What new role would you like to assign to the employee?"
                          }
                      ])
                      .then(function (answer) {
                          // Translate role to role_id
                          connection.query("SELECT * FROM role WHERE title = ?", answer.updateRole, function (err, results) {
                              if (err) throw err;

                              newRole.role_id = results[0].id;

                              connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [newRole.role_id, newRole.first_name], function (err, res) {
                                  if (err) throw (err);
                                  console.log('Employee role successfully updated.');
                                  init();
                              })

                          })
                      });
              });
          });
  })
};

//Update specific employee manager
function updateManager() {
  let newManager = {};
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee AS e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id", function (err, results) {
      if (err) throw err;
      inquirer
          .prompt([
              {
                  name: "updateEmployee",
                  type: "list",
                  choices: function () {
                      let choiceArray = [];
                      for (var i = 0; i < results.length; i++) {
                          choiceArray.push(results[i].first_name);
                      }
                      return choiceArray;
                  },
                  message: "Which employee would you like to update?"
              }
          ])
          .then(function (answer) {

              newManager.first_name = answer.updateEmployee;

              connection.query("SELECT * FROM employee", function (err, res) {
                  if (err) throw err;
                  inquirer
                      .prompt([
                          {
                              name: "updateManager",
                              type: "list",
                              choices: function () {
                                  let choiceArray = [];
                                  for (var i = 0; i < results.length; i++) {
                                      choiceArray.push(results[i].first_name);
                                  }
                                  return choiceArray;
                              },
                              message: "Who would you like to be the new manager?"
                          }
                      ])
                      .then(function (answer) {
                          connection.query("SELECT * FROM employee WHERE first_name = ?", answer.updateManager, function (err, results) {
                              if (err) throw err;

                              newManager.manager_id = results[0].id;

                              connection.query("UPDATE employee SET manager_id = ? WHERE first_name = ?", [newManager.manager_id, newManager.first_name], function (err, res) {
                                  if (err) throw (err);
                                  console.log('Employee manager successfully updated.');
                                  init();
                              })

                          })
                      });
              });
          });
  })
};

//Exit
function exit() {
  connection.end();
}
