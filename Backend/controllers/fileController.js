const File = require("../models/File");
const Project = require("../models/Project");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");

// @desc    Upload a file
// @route   POST /api/files
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
  const { projectId } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    res.status(500);
    throw new Error(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the backend .env file."
    );
  }

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isMember =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some((member) => member.toString() === req.user._id.toString());

  if (!isMember) {
    res.status(403);
    throw new Error("Not authorized to upload files to this project");
  }

  const base64File = req.file.buffer.toString("base64");
  const dataUri = `data:${req.file.mimetype};base64,${base64File}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "collabphere",
    resource_type: "auto",
    overwrite: false,
  });

  const file = await File.create({
    project: projectId,
    filename: req.file.originalname,
    fileUrl: result.secure_url,
    uploadedBy: req.user._id,
  });

  const populatedFile = await File.findById(file._id).populate(
    "uploadedBy",
    "name email"
  );

  res.status(201).json(populatedFile);
});

// @desc    Get all files for a project
// @route   GET /api/files/project/:projectId
// @access  Private
const getFilesByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Check if project exists and user has access
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isMember =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some((member) => member.toString() === req.user._id.toString());

  if (!project.isPublic && !isMember) {
    res.status(403);
    throw new Error("Not authorized to access this project");
  }

  const files = await File.find({ project: projectId })
    .populate("uploadedBy", "name email")
    .sort({ createdAt: -1 });

  res.json(files);
});

// @desc    Delete a file
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  // Check if user uploaded the file or is project owner
  const project = await Project.findById(file.project);
  const isUploader = file.uploadedBy.toString() === req.user._id.toString();
  const isOwner = project.owner.toString() === req.user._id.toString();

  if (!isUploader && !isOwner) {
    res.status(403);
    throw new Error("Not authorized to delete this file");
  }

  if (file.fileUrl) {
    try {
      const publicId = file.fileUrl
        .split("/upload/")[1]
        ?.replace(/^v\d+\//, "")
        ?.split(".")[0];

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error("Error deleting from cloudinary:", error);
    }
  }

  await file.deleteOne();

  res.json({ message: "File removed" });
});

module.exports = {
  uploadFile,
  getFilesByProject,
  deleteFile,
};
