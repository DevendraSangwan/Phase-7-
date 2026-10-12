import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../api/projectApi";
import { getNotes, createNote, updateNote, deleteNote } from "../api/noteApi";
import { getFiles, uploadFile, deleteFile } from "../api/fileApi";
import {
  explainCode,
  generateDocumentation,
  generateReadme,
} from "../api/geminiApi";
import MarkdownEditor from "../components/MarkdownEditor";
import FilePreview from "../components/FilePreview";
import "../styles/ProjectPage.css";

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Project state
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  // Members state
  const [memberEmail, setMemberEmail] = useState("");

  // Notes state
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Files state
  const [files, setFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);

  // Code state
  const [codeTitle, setCodeTitle] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [codeSavedAt, setCodeSavedAt] = useState("");

  // AI state
  const [aiCode, setAiCode] = useState("");
  const [aiLanguage, setAiLanguage] = useState("javascript");
  const [aiResult, setAiResult] = useState("");
  const [aiMode, setAiMode] = useState("explain");
  const [aiLoading, setAiLoading] = useState(false);
  const aiModeRef = useRef(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    const storageKey = `collabphere_project_code_${id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        setCodeSnippets(Array.isArray(parsed) ? parsed : []);
        setCodeSavedAt("Loaded from local storage");
      } catch (error) {
        console.error("Error parsing saved snippets:", error);
        setCodeSnippets([]);
      }
    } else {
      setCodeSnippets([]);
      setCodeSavedAt("");
    }
    setCodeTitle("");
    setCodeSnippet("");
  }, [id]);

  useEffect(() => {
    if (activeTab === "notes" && project) {
      fetchNotes();
    } else if (activeTab === "files" && project) {
      fetchFiles();
    }
  }, [activeTab, project]);

  useEffect(() => {
    const target = aiModeRef.current;
    if (!target || activeTab !== "ai") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [activeTab]);

  const fetchProject = async () => {
    try {
      const response = await getProjectById(id);
      setProject(response.data);
      setEditedTitle(response.data.title);
      setEditedDescription(response.data.description || "");

      const [notesResult, filesResult] = await Promise.allSettled([
        getNotes(id),
        getFiles(id),
      ]);

      if (notesResult.status === "fulfilled") {
        setNotes(notesResult.value.data);
      }

      if (filesResult.status === "fulfilled") {
        setFiles(filesResult.value.data);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      if (error.response?.status === 403 || error.response?.status === 404) {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await getNotes(id);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await getFiles(id);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleUpdateProject = async () => {
    try {
      const response = await updateProject(id, {
        title: editedTitle,
        description: editedDescription,
      });
      setProject(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project");
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project");
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const normalizedEmail = memberEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      alert("Please enter a valid email");
      return;
    }

    try {
      const response = await addMember(id, normalizedEmail);
      setProject(response.data);
      setMemberEmail("");
      alert("Member added successfully!");
    } catch (error) {
      console.error("Error adding member:", error);
      alert(error.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm("Remove this member from the project?")) {
      try {
        const response = await removeMember(id, userId);
        setProject(response.data);
      } catch (error) {
        console.error("Error removing member:", error);
        alert("Failed to remove member");
      }
    }
  };

  const handleCopyInviteLink = async () => {
    const inviteLink = `${window.location.origin}/project/${id}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied to clipboard!");
    } catch (error) {
      console.error("Error copying invite link:", error);
      alert("Failed to copy invite link");
    }
  };


  const handleCreateNote = async () => {
    if (!noteContent.trim()) {
      alert("Please enter some content for the note");
      return;
    }

    try {
      const response = await createNote({
        projectId: id,
        content: noteContent,
      });
      setNotes([response.data, ...notes]);
      setNoteContent("");
      alert("Note created successfully!");
    } catch (error) {
      console.error("Error creating note:", error);
      alert(error.response?.data?.message || "Failed to create note");
    }
  };

  const handleUpdateNote = async (noteId) => {
    try {
      const response = await updateNote(noteId, { content: noteContent });
      setNotes(notes.map((n) => (n._id === noteId ? response.data : n)));
      setEditingNoteId(null);
      setNoteContent("");
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Delete this note?")) {
      try {
        await deleteNote(noteId);
        setNotes(notes.filter((n) => n._id !== noteId));
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("Failed to delete note");
      }
    }
  };

  const handleFileUpload = async (eventOrFile) => {
    const incomingFile = eventOrFile instanceof File
      ? eventOrFile
      : eventOrFile?.target?.files?.[0];

    if (!incomingFile) return;

    const formData = new FormData();
    formData.append("file", incomingFile);
    formData.append("projectId", id);

    setUploadingFile(true);
    try {
      const response = await uploadFile(formData);
      setFiles((currentFiles) => [response.data, ...currentFiles]);
      if (eventOrFile?.target) {
        eventOrFile.target.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setUploadingFile(false);
      setIsDraggingFiles(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm("Delete this file?")) {
      try {
        await deleteFile(fileId);
        setFiles(files.filter((f) => f._id !== fileId));
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file");
      }
    }
  };

  const persistSnippets = (nextSnippets) => {
    const storageKey = `collabphere_project_code_${id}`;
    localStorage.setItem(storageKey, JSON.stringify(nextSnippets));
  };

  const handleSaveCode = () => {
    if (!codeTitle.trim() || !codeSnippet.trim()) {
      alert("Please provide a file name and code.");
      return;
    }

    const newSnippet = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: codeTitle.trim(),
      code: codeSnippet,
      savedAt: new Date().toISOString(),
    };

    const nextSnippets = [newSnippet, ...codeSnippets];
    setCodeSnippets(nextSnippets);
    persistSnippets(nextSnippets);
    setCodeTitle("");
    setCodeSnippet("");
    setCodeSavedAt(`Saved ${new Date().toLocaleString()}`);
  };

  const handleDeleteSnippet = (snippetId) => {
    const nextSnippets = codeSnippets.filter((snippet) => snippet.id !== snippetId);
    setCodeSnippets(nextSnippets);
    persistSnippets(nextSnippets);
  };

  const handleClearAllCode = () => {
    const storageKey = `collabphere_project_code_${id}`;
    localStorage.removeItem(storageKey);
    setCodeSnippets([]);
    setCodeTitle("");
    setCodeSnippet("");
    setCodeSavedAt("Cleared");
  };

  const handleAIAction = async () => {
    if (!aiCode.trim() && aiMode !== "readme") {
      alert("Please enter some code first");
      return;
    }

    setAiLoading(true);
    setAiResult(""); // Clear previous result
    try {
      let response;
      console.log("AI Mode:", aiMode);
      console.log("AI Code:", aiCode);
      console.log("Project:", project);
      
      if (aiMode === "explain") {
        console.log("Calling explainCode API...");
        response = await explainCode(aiCode);
        console.log("Response:", response);
        setAiResult(response.data.explanation);
      } else if (aiMode === "documentation") {
        console.log("Calling generateDocumentation API...");
        response = await generateDocumentation(aiCode, aiLanguage);
        console.log("Response:", response);
        setAiResult(response.data.documentation);
      } else if (aiMode === "readme") {
        console.log("Calling generateReadme API...");
        console.log("Project data:", {
          projectName: project.title,
          description: project.description,
        });
        response = await generateReadme({
          projectName: project.title,
          description: project.description,
        });
        console.log("Response:", response);
        setAiResult(response.data.readme);
      }
      console.log("Final AI Result:", response?.data);
    } catch (error) {
      console.error("Error with AI action:", error);
      console.error("Error details:", error.response);
      alert(error.response?.data?.message || "Failed to process AI request");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  const isOwner = project.owner._id === user?._id;

  return (
    <div className="project-page">
      <div className="project-header">
        {isEditing ? (
          <div className="edit-project">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="edit-title-input"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="edit-description-input"
              placeholder="Project description..."
            />
            <div className="edit-actions">
              <button onClick={handleUpdateProject} className="btn btn-primary">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="project-info">
              <h1>{project.title}</h1>
              <p>{project.description || "No description"}</p>
              <span className="project-owner">
                Owner: {project.owner.name || project.owner.email}
              </span>
            </div>
            {isOwner && (
              <div className="project-actions">
                <button onClick={() => setIsEditing(true)} className="btn btn-edit">
                  Edit
                </button>
                <button onClick={handleDeleteProject} className="btn btn-danger">
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="project-tabs">
        <button
          className={activeTab === "overview" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "notes" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </button>
        <button
          className={activeTab === "files" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("files")}
        >
          Files
        </button>
        <button
          className={activeTab === "members" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("members")}
        >
          Members
        </button>
        <button
          className={activeTab === "code" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
        <button
          className={activeTab === "ai" ? "tab-active" : "tab"}
          onClick={() => setActiveTab("ai")}
        >
          AI Tools
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <h2>Project Overview</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{project.members.length}</span>
                <span className="stat-label">Members</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{notes.length}</span>
                <span className="stat-label">Notes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{files.length}</span>
                <span className="stat-label">Files</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="notes-tab">
            <div className="notes-header">
              <h2>Project Notes</h2>
            </div>
            <div className="note-editor">
              <MarkdownEditor
                value={noteContent}
                onChange={setNoteContent}
                placeholder="Write your note in markdown..."
              />
              <button
                onClick={
                  editingNoteId
                    ? () => handleUpdateNote(editingNoteId)
                    : handleCreateNote
                }
                className="btn btn-primary"
              >
                {editingNoteId ? "Update Note" : "Create Note"}
              </button>
              {editingNoteId && (
                <button
                  onClick={() => {
                    setEditingNoteId(null);
                    setNoteContent("");
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="notes-list">
              {notes.length === 0 ? (
                <div className="empty-state">No notes yet. Create your first note!</div>
              ) : (
                notes.map((note) => (
                  <div key={note._id} className="note-item">
                    <div className="note-content">
                      {note.content}
                    </div>
                    <div className="note-meta">
                      <span>By: {note.createdBy?.name || note.createdBy?.email}</span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="note-actions">
                      <button
                        onClick={() => {
                          setEditingNoteId(note._id);
                          setNoteContent(note.content);
                        }}
                        className="btn-small"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="btn-small btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="files-tab">
            <div className="files-header">
              <h2>Project Files</h2>
            </div>
            <label
              className={`file-upload-dropzone ${isDraggingFiles ? "drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFiles(true);
              }}
              onDragLeave={() => setIsDraggingFiles(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingFiles(false);
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
            >
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                disabled={uploadingFile}
              />
              <div className="file-upload-icon">⬆️</div>
              <span className="file-upload-text">
                {uploadingFile ? "Uploading..." : "Drag & drop files here"}
              </span>
              <span className="file-upload-hint">or click to browse</span>
            </label>
            <div className="files-grid">
              {files.map((file) => (
                <FilePreview
                  key={file._id}
                  file={file}
                  onDelete={() => handleDeleteFile(file._id)}
                />
              ))}
            </div>
            {files.length === 0 && (
              <div className="empty-state">No files uploaded yet</div>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div className="members-tab">
            <div className="members-header">
              <h2>Team Members</h2>
              {isOwner && (
                <div className="member-actions">
                  <form onSubmit={handleAddMember} className="add-member-form">
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      placeholder="Enter member email..."
                      className="member-input"
                    />
                    <button type="submit" className="btn btn-primary">
                      Add Member
                    </button>
                  </form>
                  <div className="invite-actions">
                    <button onClick={handleCopyInviteLink} className="btn btn-secondary">
                      Copy Invite Link
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="members-list">
              {project.members.map((member) => (
                <div key={member._id} className="member-item">
                  <div className="member-info">
                    <span className="member-name">{member.name || member.email}</span>
                    {member._id === project.owner._id && (
                      <span className="owner-badge">Owner</span>
                    )}
                  </div>
                  {isOwner && member._id !== project.owner._id && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="btn-small btn-danger"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="code-tab">
            <div className="code-header">
              <div>
                <h2>Project Code</h2>
                <p className="code-subtitle">
                  Store important snippets or drafts for this project. Saved locally in your browser.
                </p>
              </div>
              <div className="code-actions">
                <button onClick={handleSaveCode} className="btn btn-primary">
                  Save Code
                </button>
                <button onClick={handleClearAllCode} className="btn btn-secondary">
                  Clear All
                </button>
              </div>
            </div>
            <div className="code-form">
              <input
                type="text"
                value={codeTitle}
                onChange={(e) => setCodeTitle(e.target.value)}
                placeholder="File name (e.g. apiClient.js)"
                className="code-title-input"
              />
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Write or paste your project code here..."
                className="code-textarea"
                rows="10"
              />
            </div>
            {codeSavedAt && <div className="code-meta">{codeSavedAt}</div>}
            <div className="code-snippet-list">
              {codeSnippets.length === 0 ? (
                <div className="empty-state">No code snippets saved yet.</div>
              ) : (
                codeSnippets.map((snippet) => (
                  <div key={snippet.id} className="code-snippet-card">
                    <div className="code-snippet-header">
                      <div>
                        <h4>{snippet.title}</h4>
                        <span className="code-snippet-date">
                          {new Date(snippet.savedAt).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSnippet(snippet.id)}
                        className="btn-small btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                    <pre className="code-snippet-preview">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="ai-tab">
            <div className="ai-header">
              <h2>AI Tools</h2>
              <div className="ai-mode-selector" ref={aiModeRef}>
                <button
                  className={aiMode === "explain" ? "mode-active" : "mode-btn"}
                  onClick={() => setAiMode("explain")}
                >
                  Explain Code
                </button>
                <button
                  className={aiMode === "documentation" ? "mode-active" : "mode-btn"}
                  onClick={() => setAiMode("documentation")}
                >
                  Generate Docs
                </button>
                <button
                  className={aiMode === "readme" ? "mode-active" : "mode-btn"}
                  onClick={() => setAiMode("readme")}
                >
                  Generate README
                </button>
              </div>
            </div>
            <div className="ai-input-section">
              {aiMode !== "readme" && (
                <>
                  <select
                    value={aiLanguage}
                    onChange={(e) => setAiLanguage(e.target.value)}
                    className="language-select"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                  </select>
                  <textarea
                    value={aiCode}
                    onChange={(e) => setAiCode(e.target.value)}
                    placeholder="Paste your code here..."
                    className="ai-code-input"
                    rows="10"
                  />
                </>
              )}
              <button
                onClick={handleAIAction}
                className="btn btn-primary"
                disabled={aiLoading}
              >
                {aiLoading ? "Processing..." : `Generate ${aiMode === "explain" ? "Explanation" : aiMode === "documentation" ? "Documentation" : "README"}`}
              </button>
            </div>
            {aiResult && (
              <div className="ai-result">
                <h3>Result:</h3>
                <div className="result-content">{aiResult}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
