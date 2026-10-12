const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    filename: String,
    fileUrl: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);