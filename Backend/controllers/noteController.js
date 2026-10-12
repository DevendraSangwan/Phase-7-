const Note = require("../models/Note");
const Project = require("../models/Project");
const asyncHandler = require("express-async-handler");

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  const { projectId, content } = req.body;

  // Check if project exists and user has access
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isMember = project.members.some(
    (member) => member.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(403);
    throw new Error("Not authorized to add notes to this project");
  }

  const note = await Note.create({
    project: projectId,
    content,
    createdBy: req.user._id,
  });

  const populatedNote = await Note.findById(note._id).populate(
    "createdBy",
    "name email"
  );

  res.status(201).json(populatedNote);
});

// @desc    Get all notes for a project
// @route   GET /api/notes/:projectId
// @access  Private
const getNotesByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Check if project exists and user has access
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isMember = project.members.some(
    (member) => member.toString() === req.user._id.toString()
  );
  if (!project.isPublic && !isMember) {
    res.status(403);
    throw new Error("Not authorized to access this project");
  }

  const notes = await Note.find({ project: projectId })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json(notes);
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  // Check if user created the note or is project owner
  const project = await Project.findById(note.project);
  const isCreator = note.createdBy.toString() === req.user._id.toString();
  const isOwner = project.owner.toString() === req.user._id.toString();

  if (!isCreator && !isOwner) {
    res.status(403);
    throw new Error("Not authorized to update this note");
  }

  note.content = req.body.content || note.content;
  const updatedNote = await note.save();

  const populatedNote = await Note.findById(updatedNote._id).populate(
    "createdBy",
    "name email"
  );

  res.json(populatedNote);
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  // Check if user created the note or is project owner
  const project = await Project.findById(note.project);
  const isCreator = note.createdBy.toString() === req.user._id.toString();
  const isOwner = project.owner.toString() === req.user._id.toString();

  if (!isCreator && !isOwner) {
    res.status(403);
    throw new Error("Not authorized to delete this note");
  }

  await note.deleteOne();

  res.json({ message: "Note removed" });
});

module.exports = {
  createNote,
  getNotesByProject,
  updateNote,
  deleteNote,
};
