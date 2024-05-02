const mysql = require("../mysql");

let actions = {
  addActions(req, res, next) {
    let recordingId = req.body.params.recordingId;
    let xPos = req.body.params.xPos;
    let yPos = req.body.params.yPos;

    // insert into Actions (recording_id, action_x, action_y) values (recording_id, 10, 10);
    mysql.query(
      `INSERT INTO Actions (recording_id, action_x, action_y)
      VALUES ('${recordingId}', '${xPos}', '${yPos}');`,
      (error, result) => {
        if (error) {
          throw err;
        }
      }
    );
  },
};

module.exports = actions;
