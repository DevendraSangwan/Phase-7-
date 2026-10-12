const Project = require("../models/Project");
const asyncHandler = require("express-async-handler");

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { title, description, isPublic } = req.body;

  const project = await Project.create({
    title,
    description,
    owner: req.user._id,
    members: [req.user._id],
    isPublic: isPublic || false,
  });

  res.status(201).json(project);
});

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  })
    .populate("owner", "name email")
    .populate("members", "name email")
    .sort({ updatedAt: -1 });

  res.json(projects);
});

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Private (or public if isPublic)
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("owner", "name email")
    .populate("members", "name email");

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check if user has access to the project
  const isMember = project.members.some(
    (member) => member._id.toString() === req.user._id.toString()
  );
  const isOwner = project.owner._id.toString() === req.user._id.toString();

  if (!project.isPublic && !isMember && !isOwner) {
    res.status(403);
    throw new Error("Not authorized to access this project");
  }

  res.json(project);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (owner only)
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check if user is the owner
  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this project");
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate("owner", "name email")
    .populate("members", "name email");

  res.json(updatedProject);
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (owner only)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check if user is the owner
  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this project");
  }

  await project.deleteOne();

  res.json({ message: "Project removed" });
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (owner only)
const addMember = asyncHandler(async (req, res) => {
  const email = req.body?.email?.trim()?.toLowerCase();

  if (!email) {
    res.status(400);
    throw new Error("Please provide member email");
  }

  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check if user is the owner
  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only project owner can add members");
  }

  // Find user by email
  const User = require("../models/User");
  const userToAdd = await User.findOne({ email });

  if (!userToAdd) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if already a member
  if (project.members.some((memberId) => memberId.toString() === userToAdd._id.toString())) {
    res.status(400);
    throw new Error("User is already a member");
  }

  project.members.push(userToAdd._id);
  await project.save();

  const updatedProject = await Project.findById(project._id)
    .populate("owner", "name email")
    .populate("members", "name email");

  res.json(updatedProject);
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (owner only)
const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check if user is the owner
  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only project owner can remove members");
  }

  // Cannot remove owner
  if (req.params.userId === project.owner.toString()) {
    res.status(400);
    throw new Error("Cannot remove project owner");
  }

  project.members = project.members.filter(
    (member) => member.toString() !== req.params.userId
  );

  await project.save();

  const updatedProject = await Project.findById(project._id)
    .populate("owner", "name email")
    .populate("members", "name email");

  res.json(updatedProject);
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
