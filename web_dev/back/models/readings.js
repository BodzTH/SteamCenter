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
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.model("temphumlogs", tempHumSchema);
