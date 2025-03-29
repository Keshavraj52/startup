const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthdate: { type: Date, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    bloodGroup: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["donor", "recipient", "admin"], default: "donor" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
