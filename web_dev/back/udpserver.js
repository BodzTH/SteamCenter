require("dotenv").config();
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const mongoose = require("mongoose");
require("dotenv").config();

server.on("message", (msg, rinfo) => {
  console.log(
    `Received UDP message from ${rinfo.address}:${rinfo.port}: ${msg}`
  );
});

server.on("listening", () => {
  const address = server.address();
  console.log(`UDP server listening on ${address.address}:${address.port}`);
});

const IP = process.env.IP;
const PORT = process.env.PORTUDP;
server.bind({
  address: IP,
  port: PORT,
  exclusive: true,
});
