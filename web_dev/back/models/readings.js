const mongoose = require("mongoose");
const { Schema } = mongoose;

const tempHumSchema = new mongoose.Schema({
  temperature: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  humidity: {
    type: Schema.Types.Decimal128,
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
