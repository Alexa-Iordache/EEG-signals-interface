const mysql = require("../mysql");
const jwt = require("jsonwebtoken");

// compares 2 passwords: a given password and the password from database
function comparePasswords(password, dbResult) {
  if (password == dbResult) return 1;
  return 0;
}

let auth = {
  login(req, res, next) {
    let username = req.body.params.username;
    let password = req.body.params.password;

    mysql.query(
      `SELECT * FROM Users WHERE username = '${username}' LIMIT 1`,
      (error, result) => {
        // verifica daca a fost gasit vreun user cu username ul dat
        if (result.length == 0) {
          // trimite raspuns in frontend sub forma de json
          res.json({ id: 1, error: "no such user", result: null });
        }

        result = result[0];
        console.log({ pass: result.Password, password });
        const samePassword = comparePasswords(result.password, password);
        if (!samePassword) {
          res.json({ id: 1, error: "password is incorrect", result: null });
          return;
        }

        let receivedUsername = { username: result.Username };
        jwt.sign(
          receivedUsername,
          "JWTSecretKeyForEEGAp",
          (error, encoded) => {
            receivedUsername.encoded = encoded;
            res.json({ id: 1, error: null, result: receivedUsername });
          }
        );
      }
    );
  },

  getUsers(req, res, next) {
    let username = req.body.params.username;

    mysql.query(`SELECT * FROM Users WHERE username = '${username}' LIMIT 1`, (error, result) => {
      res.json({ id: 1, error: null, result: result });
    });
  },

  updateUser(req, res, next) {
    let username = req.body.params.username;
    let first_name = req.body.params.first_name;
    let last_name = req.body.params.last_name;
    let age = req.body.params.age;
    let sex = req.body.params.sex;
    let medical_problems = req.body.params.medical_problems;
    let causes = req.body.params.causes;

    mysql.query(`UPDATE Users SET first_name = '${first_name}', last_name = '${last_name}', 
    age = ${age}, sex = '${sex}', medical_problems = '${medical_problems}',
    causes = '${causes}' WHERE username = '${username}';`, (error, result) => {
      res.json({ id: 1, error: null, result: result });
    });
  },
};

module.exports = auth;