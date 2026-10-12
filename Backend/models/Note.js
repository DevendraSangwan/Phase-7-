const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    title: { type: String, default: "Untitled Note" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    content: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);