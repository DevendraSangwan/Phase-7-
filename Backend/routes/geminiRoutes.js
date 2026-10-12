const express = require("express");
const router = express.Router();
const {
  explainCode,
  generateDocumentation,
  generateReadme,
  generateCode,
} = require("../controllers/geminiController");
const protect = require("../middleware/authMiddleware");

router.post("/explain", protect, explainCode);
router.post("/generate-docs", protect, generateDocumentation);
router.post("/generate-readme", protect, generateReadme);
router.post("/generate-code", protect, generateCode);

module.exports = router;