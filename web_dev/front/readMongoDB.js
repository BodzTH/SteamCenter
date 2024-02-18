const devices = require("./models/devices");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/hardwareDB")
  .then(() => {
    console.log("Connected to MongoDB");

    // Query the database
    devices
      .find()
      .then((docs) => {
        docs.forEach((doc) => {
          console.log(doc); // Logs the coordinates of each document
        });
      })
      .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
