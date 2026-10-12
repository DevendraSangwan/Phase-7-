import axios from "./axios";

export const explainText = (text) =>
  axios.post("/gemini/explain", { text });

export const explainCode = (code) =>
  axios.post("/gemini/explain", { code });

export const generateDocumentation = (code, language) =>
  axios.post("/gemini/generate-docs", { code, language });

export const generateReadme = (projectData) =>
  axios.post("/gemini/generate-readme", projectData);

export const generateCode = (description, language) =>
  axios.post("/gemini/generate-code", { description, language });