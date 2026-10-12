const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Project = require("../models/Project");
const Note = require("../models/Note");
const File = require("../models/File");

// Get all users (without passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().populate("owner", "name email");
    res.json({ count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all notes
router.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().populate("user", "name email");
    res.json({ count: notes.length, notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all files
router.get("/files", async (req, res) => {
  try {
    const files = await File.find().populate("user", "name email");
    res.json({ count: files.length, files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get database stats
router.get("/stats", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    const noteCount = await Note.countDocuments();
    const fileCount = await File.countDocuments();

    res.json({
      database: "connected",
      collections: {
        users: userCount,
        projects: projectCount,
        notes: noteCount,
        files: fileCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
