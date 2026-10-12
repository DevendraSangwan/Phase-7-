import axios from "./axios";

export const uploadFile = (formData) =>
  axios.post("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getFiles = (projectId) =>
  axios.get(`/files/project/${projectId}`);

export const deleteFile = (id) =>
  axios.delete(`/files/${id}`);