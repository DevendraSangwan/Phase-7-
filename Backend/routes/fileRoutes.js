const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getFilesByProject,
  deleteFile,
} = require("../controllers/fileController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadmiddleware");

router.route("/").post(protect, upload.single("file"), uploadFile);
router.route("/project/:projectId").get(protect, getFilesByProject);
router.route("/:id").delete(protect, deleteFile);

module.exports = router;
