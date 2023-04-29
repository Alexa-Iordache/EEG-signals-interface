const { exec, spawn } = require("node:child_process");
const { stderr } = require("node:process");

let finalImage = {
  showFinalImage(req, res, next) {
    exec("python3 src/handlers/finalImageCode.py", (error, stdout, stderr) => {
      console.log("error: " + error);
      console.log("stdout: " + stdout);
      console.log("stderr: " + stderr);
      if (error == null) {
        res.json({ id: 1, error: null, result: stdout });
      }
    });
  },
};

module.exports = finalImage;