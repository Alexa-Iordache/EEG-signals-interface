const mysql = require("mysql");
let connection;

function connect(callback) {
  connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "EEG_signals",
  });

  connection.getConnection((error, variable) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, variable);
    }
  });
}

function query(query, callback) {
  connection.query(query, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
}

module.exports = { connect, query };
