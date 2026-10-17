const model = require("../config/gemini");
const asyncHandler = require("express-async-handler");

// @desc    Explain code
// @route   POST /api/gemini/explain
// @access  Private
exports.explainCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Please provide code to explain");
  }

  try {
    // console.log("Generating explanation for:", code);
    const result = await model.generateContent(
      `You are an expert code explainer. Explain the following code in detail, including what it does, how it works, and any important patterns or best practices used:\n\n${code}`
    );

    const response = await result.response;
    const text = response.text();
    // console.log("Generated explanation:", text);
    res.json({ explanation: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500);
    throw new Error(error.message || "Failed to generate explanation");
  }
});

// @desc    Generate documentation
// @route   POST /api/gemini/generate-docs
// @access  Private
exports.generateDocumentation = asyncHandler(async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Please provide code to document");
  }

  try {
    // console.log("Generating documentation for:", code);
    const result = await model.generateContent(
      `Generate comprehensive documentation for the following ${language || "code"}. Include function/class descriptions, parameter explanations, return values, and usage examples:\n\n${code}`
    );

    const response = await result.response;
    const text = response.text();
    // console.log("Generated documentation");
    res.json({ documentation: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500);
    throw new Error(error.message || "Failed to generate documentation");
  }
});

// @desc    Generate README
// @route   POST /api/gemini/generate-readme
// @access  Private
exports.generateReadme = asyncHandler(async (req, res) => {
  const { projectName, description, technologies, features } = req.body;

  if (!projectName) {
    res.status(400);
    throw new Error("Please provide project name");
  }

  try {
    const prompt = `Generate a professional README.md file for a project with the following details:
  
Project Name: ${projectName}
Description: ${description || "A software project"}
Technologies: ${technologies || "Not specified"}
Features: ${features || "Not specified"}

Include sections for: Title, Description, Features, Technologies Used, Installation, Usage, Contributing, and License.`;

    // console.log("Generating README for project:", projectName);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // console.log("Generated README");
    res.json({ readme: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500);
    throw new Error(error.message || "Failed to generate README");
  }
});

// @desc    Generate code from description
// @route   POST /api/gemini/generate-code
// @access  Private
exports.generateCode = asyncHandler(async (req, res) => {
  const { description, language } = req.body;

  if (!description) {
    res.status(400);
    throw new Error("Please provide a description");
  }

  try {
    // console.log("Generating code for:", description);
    const result = await model.generateContent(
      `Generate ${language || "code"} for the following requirement:\n\n${description}\n\nProvide clean, well-commented code following best practices.`
    );

    const response = await result.response;
    const text = response.text();
    // console.log("Generated code");
    res.json({ code: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500);
    throw new Error(error.message || "Failed to generate code");
  }
});