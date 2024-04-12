const mysql = require("../mysql");

let obstacles = {
  getObstacles(req, res, next) {
    mysql.query(`SELECT * FROM Obstacles;`, (error, result) => {
      if (result.length == 0) {
        res.json({ id: 1, error: "does not exist obstacles", result: null });
      }

      res.json({ id: 1, error: null, result: result });
    });
  },

  addObstacle(req, res, next) {
    let xPos = req.body.params.xPos;
    let yPos = req.body.params.xPos;
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

  // deletePatient(req, res, next) {
  //   let id = req.body.params.id;
  //   console.log("a intrat in be");
  //   console.log(id);
  //   mysql.query(
  //     `DELETE FROM Patients P WHERE ((P.PatientID = '${id}'));`,
  //     (err, result) => {
  //       if (err) {
  //         throw err;
  //       }
  //     }
  //   );
  // }
};

module.exports = obstacles;
