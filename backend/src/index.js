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

// message = "";

// // Create a server object
// const server = net.createServer((socket) => {
//   app.post("/apply-changes", (req, res) => {
//     const { width, height } = req.body; // Ensure these are sent from the client
//     console.log(`Received width: ${width} and height: ${height}`);

//     // Send these values to the Python script
//     message = JSON.stringify({ width, height });
//     // When data is received, print it to the console
//     socket.on("data", (data) => {
//       console.log("Received data:", data.toString());
//       // Send data back to the client
//       socket.write(message);
//     });

//     // When the connection is closed, print a message
//     socket.on("close", () => {
//       console.log("Connection closed");
//     });
//   });
// });

// // Define the server address and port
// const server_address = "0.0.0.0"; // replace with the actual IP of the Node.js server
// const server_port = 4202; // replace with the actual port of the Node.js server

// // Start the server
// server.listen(server_port, server_address, () => {
//   console.log("Server started at", server_address, ":", server_port);
// });
