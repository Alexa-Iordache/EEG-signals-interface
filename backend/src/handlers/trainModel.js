const mysql = require("../mysql");

let obstacles = {
  getObstacles(req, res, next) {
    mysql.query(`SELECT * FROM Obstacles;`, (error, result) => {
      res.json({ id: 1, error: null, result: result });
    });
  },

  addObstacle(req, res, next) {
    let xPos = req.body.params.xPos;
    let yPos = req.body.params.yPos;
    let width = req.body.params.width;
    let height = req.body.params.height;

    mysql.query(
      `INSERT INTO Obstacles (xPos, yPos, width, height) 
        VALUES ('${xPos}', '${yPos}', '${width}', '${height}');`,
      (error, result) => {
        if (error) {
          throw err;
        }
      }
    );
  },

  deleteObstacle(req, res, next) {
    let width = req.body.params.width;
    let height = req.body.params.height;
    let xPos = req.body.params.xPos;
    let yPos = req.body.params.yPos;

    console.log(width, height, xPos, yPos);
    mysql.query(
      `DELETE FROM Obstacles WHERE (xPos = '${xPos}' and yPos = '${yPos}' and
        width = '${width}' and height = '${height}');`,
      (err, result) => {
        if (err) {
          throw err;
        }
      }
    );
  },
};

module.exports = obstacles;
