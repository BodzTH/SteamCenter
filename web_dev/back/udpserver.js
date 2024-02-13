require("dotenv").config();
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const temphumlogs = require("./models/readings");
const mongoose = require("mongoose");

//receive message the message from esp01s
server.on("message", async (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  // Parse the message
  const data = msg.toString();
  const humidity = parseFloat(data.split("Humidity: ")[1]);
  const temp = parseFloat(data.split("Temperature: ")[1]);

  let date = new Date();

  // Cairo, Egypt is 2 hours ahead of UTC
  let offset = 2;

  // Convert the local time to Cairo, Egypt time
  date.setHours(date.getHours() + offset);

  // Save to MongoDB
  try {
    const newTempHum = await temphumlogs.create({
      temp,
      humidity,
      date: date,
    });
    console.log("Data saved:", newTempHum);
  } catch (err) {
    console.error("Error saving data:", err.message);
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
const IP = process.env.IP;
const PORT = process.env.PORTUDP;
server.bind({
  address: IP,
  port: PORT,
  exclusive: true,
});
