const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(cors({
  origin: 'https://venerable-semolina-c405b0.netlify.app',
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/gemini", require("./routes/geminiRoutes"));
app.use("/api/projects", require("./routes/projectrouts"));
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/files", require("./routes/fileRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use(errorHandler);
const path = require('path');

app.get('/', (req, res) => {
  res.send('CollabSphere API is running');
});

module.exports = app;