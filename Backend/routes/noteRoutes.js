const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotesByProject,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const protect = require("../middleware/authMiddleware");

router.route("/").post(protect, createNote);
router.route("/project/:projectId").get(protect, getNotesByProject);
router.route("/:id").put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;
