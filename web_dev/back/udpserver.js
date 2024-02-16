require("dotenv").config();
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const temphumlogs = require("./models/readings");
const mongoose = require("mongoose");

server.on("message", async (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  // Parse the incoming message to extract data
  const messageParts = msg.toString().split("\n");

  if (messageParts.length === 2) {
    const datetimePart = messageParts[0].trim();
    const humidityPart = messageParts[1].match(/Humidity: (\d+\.\d+)% Temperature: (\d+\.\d+)C/);

    if (humidityPart) {
      const date = datetimePart.split(" ")[0];
      const time = datetimePart.split(" ")[1];
      const humidity = parseFloat(humidityPart[1]);
      const temp = parseFloat(humidityPart[2]);

      // Save to MongoDB
      try {
        const newTempHum = await temphumlogs.create({
          temp,
          humidity,
          date,
          time,
        });
        console.log("Data saved:", newTempHum);
      } catch (err) {
        console.error("Error saving data:", err.message);
      }
    } else {
      console.error("Invalid humidity and temperature format");
    }
  } else {
    console.error("Invalid message format");
  }
});



//connect to local MongoDB
mongoose
  .connect("mongodb://localhost:27017/TempLogs")
  .then(() => {
    //listen for server
    server.on("listening", () => {
      const address = server.address();
      console.log(
        `Connected to DB & UDP server listening on ${address.address}:${address.port}`
      );
    });
  })
  .catch((err) => console.log(err));

//bind server to IP and port
const IP = process.env.IP2;
const PORT = process.env.PORTUDP1;
server.bind({
  address: IP,
  port: PORT,
  exclusive: true,
});
