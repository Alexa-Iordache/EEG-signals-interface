const mysql = require("../mysql");

let obstacles = {
  // getObstacles(req, res, next) {
  //   mysql.query(`SELECT * FROM Obstacles;`, (error, result) => {
  //     res.json({ id: 1, error: null, result: result });
  //   });
  // },

  addObstacle(req, res, next) {
    let recordingId = req.body.params.recordingId;
    let width = req.body.params.width;
    let height = req.body.params.height;
    let xPos = req.body.params.xPos;
    let yPos = req.body.params.yPos;

    mysql.query(
      `INSERT INTO Obstacles (recording_id, obstacle_width, obstacle_height, obstacle_x, obstacle_y) 
        VALUES ('${recordingId}', '${width}', '${height}', '${xPos}', '${yPos}');`,
      (error, result) => {
        if (error) {
          throw err;
        }
      }
    );
  },

  // deleteObstacle(req, res, next) {
  //   let width = req.body.params.width;
  //   let height = req.body.params.height;
  //   let xPos = req.body.params.xPos;
  //   let yPos = req.body.params.yPos;

  //   mysql.query(
  //     `DELETE FROM Obstacles WHERE (obstacle_width = '${width}' and obstacle_height = '${height}' and
  //       obstacle_x = '${xPos}' and obstacle_y = '${yPos}');`,
  //     (err, result) => {
  //       if (err) {
  //         throw err;
  //       }
  //     }
  //   );
  // },
};

module.exports = obstacles;
