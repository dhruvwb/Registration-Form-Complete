const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: String, required: true },
    classs: {
      type: String,
      required: true,
      // enum: ["0-5", "6-8", "9-10", "11-12"],
    },
    gender: { type: String, required: true },
    pinCode: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    startDate: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
