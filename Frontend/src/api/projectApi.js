import axios from "./axios";

export const getProjects = () => axios.get("/projects");

export const createProject = (data) => axios.post("/projects", data);

export const getProjectById = (id) => axios.get(`/projects/${id}`);

export const updateProject = (id, data) => axios.put(`/projects/${id}`, data);

export const deleteProject = (id) => axios.delete(`/projects/${id}`);

export const addMember = (projectId, email) =>
  axios.post(`/projects/${projectId}/members`, { email });

export const removeMember = (projectId, userId) =>
  axios.delete(`/projects/${projectId}/members/${userId}`);