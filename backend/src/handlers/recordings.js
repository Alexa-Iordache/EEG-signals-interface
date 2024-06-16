const mysql = require("../mysql");

let recordings = {
  getRecordings(req, res, next) {
    mysql.query(`SELECT * FROM Recordings;`, (error, result) => {
      res.json({ id: 1, error: null, result: result });
    });
  },

  addRecording(req, res, next) {
    let width = req.body.params.width;
    let height = req.body.params.height;
    let step = req.body.params.step;
    let start_x = req.body.params.start_x;
    let start_y = req.body.params.start_y;
    let finish_x = req.body.params.finish_x;
    let finish_y = req.body.params.finish_y;
    let configuration_time = req.body.params.configuration_time;
    let performance = req.body.params.performance;
    let actions = req.body.params.actions;
    let description = req.body.params.description;
    let room_name = req.body.params.room_name;

    mysql.query(
      `INSERT INTO Recordings (board_width, board_height, robot_step, robot_start_x, robot_start_y, 
        robot_finish_x, robot_finish_y, configuration_time, performance, actions, description, room_name) 
        VALUES ('${width}', '${height}', '${step}', '${start_x}',
        '${start_y}', '${finish_x}', '${finish_y}', '${configuration_time}', '${performance}', 
        '${actions}', '${description}', '${room_name}');`,
      (error, result) => {
        if (error) {
          throw error;
        }

        // Send the recording ID back in the response
        const recordingId = result.insertId;
        res.send(recordingId.toString());
      }
    );
  },

  getOneRecording(req, res, next) {
    let recordingID = req.body.params.recordingID;

    mysql.query(
      `SELECT * FROM Recordings WHERE id = '${recordingID}';`,
      (error, result) => {
        if (error) {
          throw error;
        }
        if (result.length == 0) {
          res.json({
            id: 1,
            error: "does not exist any recordings",
            result: null,
          });
        }
        res.json({ id: 1, error: null, result: result });
      }
    );
  },

  deleteRecording(req, res, next) {
    let recordingID = req.body.params.recordingID;
    mysql.query(
      `DELETE FROM Recordings WHERE id = '${recordingID}';`,
      (error, result) => {
        if (error) {
          throw error;
        }
      }
    );
  },

  checkDuplicateRecording(req, res, next) {
    let room_name = req.body.params.room_name;
    let description = req.body.params.description;

    mysql.query(
      `SELECT * FROM Recordings WHERE room_name = '${room_name}' AND description = '${description}';`,
      (error, results) => {
        if (error) {
          return next(error);
        }
        if (results.length > 0) {
          return res.json({ exists: true });
        } else {
          return res.json({ exists: false });
        }
      }
    );
  },
};

module.exports = recordings;
