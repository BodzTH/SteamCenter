import mongoose from "mongoose";

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

export default mongoose.model("temphumlogs", tempHumSchema);