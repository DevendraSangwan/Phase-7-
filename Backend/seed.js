require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Project = require("./models/Project");
const Note = require("./models/Note");
const File = require("./models/File");

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Note.deleteMany({}),
      File.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        name: "Devendra Sangwan",
        email: "devendra@example.com",
        password: "123456",
      },
      {
        name: "Aisha Khan",
        email: "aisha@example.com",
        password: "123456",
      },
      {
        name: "Rahul Verma",
        email: "rahul@example.com",
        password: "123456",
      },
    ]);

    const [owner, memberOne, memberTwo] = users;

    const projects = await Project.insertMany([
      {
        title: "CollabSphere MVP",
        description: "Main project planning and documentation workspace for the product MVP.",
        owner: owner._id,
        members: [owner._id, memberOne._id],
        isPublic: true,
      },
      {
        title: "Marketing Launch Plan",
        description: "Campaign content, social rollout plan, and launch checklist for the team.",
        owner: memberOne._id,
        members: [memberOne._id, memberTwo._id, owner._id],
        isPublic: false,
      },
    ]);

    const [projectOne, projectTwo] = projects;

    await Note.insertMany([
      {
        title: "Kickoff Notes",
        project: projectOne._id,
        content: "# Kickoff Notes\n\n- Finalize MVP scope\n- Set up backend APIs\n- Create user dashboard\n- Review upload flow",
        createdBy: owner._id,
      },
      {
        title: "Daily Standup",
        project: projectOne._id,
        content: "Discuss API integration and file preview improvements for the dashboard.",
        createdBy: memberOne._id,
      },
      {
        title: "Launch Checklist",
        project: projectTwo._id,
        content: "- Confirm PR approvals\n- Publish landing page\n- Update blog copy\n- Track campaign metrics",
        createdBy: memberTwo._id,
      },
    ]);

    await File.insertMany([
      {
        project: projectOne._id,
        filename: "architecture.md",
        fileUrl: "https://example.com/files/architecture.md",
        uploadedBy: owner._id,
      },
      {
        project: projectOne._id,
        filename: "screenshot.png",
        fileUrl: "https://example.com/files/screenshot.png",
        uploadedBy: memberOne._id,
      },
      {
        project: projectTwo._id,
        filename: "launch-plan.pdf",
        fileUrl: "https://example.com/files/launch-plan.pdf",
        uploadedBy: memberTwo._id,
      },
    ]);

    console.log("✅ Seed data inserted successfully.");
    console.log(`Users: ${users.length}`);
    console.log(`Projects: ${projects.length}`);
    console.log("Seed completed.");
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
