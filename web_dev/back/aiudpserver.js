require("dotenv").config();
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const temphumlogs = require("./models/readings");
const mongoose = require("mongoose");

// Receive message from esp01s
server.on("message", async (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

// Connect to local MongoDB
mongoose
  .connect("mongodb://localhost:27017/TempLogs")
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Listen for server
    server.on("listening", () => {
      const address = server.address();
      console.log(
        `UDP server is listening on ${address.address}:${address.port}`
      );
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// Bind server to IP and port
const IP = process.env.IP2;
const PORT = process.env.PORTUDP2;
server.bind({
  address: IP,
  port: PORT,
  exclusive: true,
});

console.log(`Server is bound to IP: ${IP} and port: ${PORT}`);
