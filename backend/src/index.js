const express = require("express");
const mysql = require("./mysql.js");
const cors = require("cors");
const router = require("./api.js");
const bodyParser = require("body-parser");
const app = express();
const net = require("net");

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(bodyParser.json());

app.listen(4201, () => {
  console.log("merge portul");

  mysql.connect((error, result) => {
    if (error) {
      throw error;
    } else {
      console.log("conectat la baza de date");
    }
  });
});

const server_address = "0.0.0.0";
const server_port = 4202;
let dataFromPython;

const server = net.createServer((socket) => {
  console.log("Client connected");

  // Handle incoming data from the client
  socket.on("data", (data) => {
    dataFromPython = data.toString();
    console.log("Received:", data.toString());
    socket.write('0');
  });

  // Handle end of connection
  socket.on("end", () => {
    console.log("Client disconnected");
  });

  // Handle POST requests from the Angular application
  app.post("/send-data", (req, res) => {
    const { test } = req.body;
    console.log("Received test value from Angular:", test);
    console.log("Sending test value to the client:", test);
    socket.write(test);
  });
});

app.get("/get-data-from-python", (req, res) => {
  data = dataFromPython;
  res.json({ data });
});

server.listen(server_port, server_address, () => {
  console.log("Server started at", server_address, ":", server_port);
});
