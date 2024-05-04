const mysql = require("../mysql");

let recordings = {
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

    mysql.query(
      `INSERT INTO Recordings (board_width, board_height, robot_step, robot_start_x, robot_start_y, 
        robot_finish_x, robot_finish_y, configuration_time, performance, actions, description) 
        VALUES ('${width}', '${height}', '${step}', '${start_x}',
        '${start_y}', '${finish_x}', '${finish_y}', '${configuration_time}', '${performance}', 
        '${actions}', '${description}');`,
      (error, result) => {
        if (error) {
          throw err;
        }

        // Send the recording ID back in the response
        const recordingId = result.insertId;
        res.send(recordingId.toString());
      }
    );
  },
};

module.exports = recordings;
