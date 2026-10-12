const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);