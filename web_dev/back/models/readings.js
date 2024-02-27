const mongoose = require("mongoose");
const { Schema } = mongoose;

const tempHumSchema = new mongoose.Schema({
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
