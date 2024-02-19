require("dotenv").config();
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const mongoose = require("mongoose");

server.on("message", async (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  // Parse the incoming message as JSON
  let data;
  try {
    data = JSON.parse(msg);
  } catch (err) {
    console.error(`Error parsing message as JSON: ${err.message}`);
    return;
  }

  // Check if the JSON object has a checkId property
  if (data.hasOwnProperty("checkId")) {
    let checkId = data.checkId;
    console.log(`Received checkId: ${checkId}`);
    if (checkId) {
      // Send an "OK" message back
      const response = "OK";
      server.send(response, rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.error(`Error sending response: ${err.message}`);
        } else {
          console.log(`Sent response: ${response}`);
        }
      });
    }
  }
  // Check if the JSON object has Humidity, Temperature, Latitude, Longitude, date, and time properties
  else if (
    data.hasOwnProperty("Humidity") &&
    data.hasOwnProperty("Temperature") &&
    data.hasOwnProperty("Latitude") &&
    data.hasOwnProperty("Longitude") &&
    data.hasOwnProperty("date") &&
    data.hasOwnProperty("time")
  ) {
    let humidity = data.Humidity;
    let temperature = data.Temperature;
    let latitude = data.Latitude;
    let longitude = data.Longitude;
    let date = data.date;
    let time = data.time;
    console.log(
      `Received data: Humidity=${humidity}, Temperature=${temperature}, Latitude=${latitude}, Longitude=${longitude}, Date=${date}, Time=${time}`
    );
    // Handle the received data...
  }
});

mongoose
  .connect("mongodb://localhost:27017/TempLogs")
  .then(() => {
    server.on("listening", () => {
      const address = server.address();
      console.log(
        `Connected to DB & UDP server listening on ${address.address}:${address.port}`
      );
    });
  })
  .catch((err) => console.log(err));

const IP = process.env.IP2;
const PORT = process.env.PORTUDP1;
server.bind({
  address: IP,
  port: PORT,
  exclusive: true,
});
console.log(`UDP server is running on ${IP}:${PORT}`);
