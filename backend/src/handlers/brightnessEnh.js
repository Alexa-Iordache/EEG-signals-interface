const { exec, spawn } = require("node:child_process");
const { stderr } = require("node:process");

let brightness = {
  brightnessEnhancement(req, res, next) {
    let imagepath = req.body.params.imagepath
    let command = `python3 src/handlers/brigtnessEnhCode.py --imagePath './src/processImages/${imagepath}'`

    exec(command, (error, stdout, stderr) => {
      console.log("error: " + error);
      console.log("stdout: " + stdout);
      console.log("stderr: " + stderr);
      if (error == null) {
        res.json({ id: 1, error: null, result: stdout });
      }
    });
  },
};

module.exports = brightness;