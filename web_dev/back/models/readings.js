const mongoose = require("mongoose");

const tempHumSchema = new mongoose.Schema({
  temp: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  date: {
    type: String, 
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("temphumlogs", tempHumSchema);
