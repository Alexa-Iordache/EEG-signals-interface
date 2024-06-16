const mysql = require("../mysql");

let obstacles = {
  getObstacles(req, res, next) {
    mysql.query(`SELECT * FROM Obstacles;`, (error, result) => {
      res.json({ id: 1, error: null, result: result });
    });
  },

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
          throw error;
        }
      }
    );
  },

  getObstaclesForOneRecording(req, res, next) {
    let recordingID = req.body.params.recordingID;

    mysql.query(
      `SELECT * FROM Obstacles WHERE recording_id = '${recordingID}';`,

      (error, result) => {
        if (result.length == 0) {
          res.json({
            id: 1,
            error: "does not exist any obstacles for this recording",
            result: null,
          });
        }
        res.json({ id: 1, error: null, result: result });
      }
    );
  }
};

module.exports = obstacles;
