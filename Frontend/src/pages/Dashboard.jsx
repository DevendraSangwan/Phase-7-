import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject } from "../api/projectApi";
import { getNotes } from "../api/noteApi";
import { getFiles } from "../api/fileApi";
import ProjectCard from "../components/ProjectCard";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectCounts, setProjectCounts] = useState({});
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
      await fetchProjectCounts(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectCounts = async (projectList) => {
    if (!projectList?.length) {
      setProjectCounts({});
      setTotalFiles(0);
      setTotalNotes(0);
      return;
    }

    const results = await Promise.all(
      projectList.map(async (project) => {
        try {
          const [notesResponse, filesResponse] = await Promise.all([
            getNotes(project._id),
            getFiles(project._id),
          ]);

          return {
            id: project._id,
            notes: notesResponse.data.length,
            files: filesResponse.data.length,
          };
        } catch (error) {
          console.error("Error fetching counts for project:", project._id, error);
          return { id: project._id, notes: 0, files: 0 };
        }
      })
    );

    const countMap = results.reduce((acc, item) => {
      acc[item.id] = { notes: item.notes, files: item.files };
      return acc;
    }, {});

    setProjectCounts(countMap);
    setTotalNotes(results.reduce((sum, item) => sum + item.notes, 0));
    setTotalFiles(results.reduce((sum, item) => sum + item.files, 0));
  };

  const handleNewProject = async () => {
    try {
      const response = await createProject({
        title: newProject.title.trim() || "Untitled Project",
        description: newProject.description.trim(),
        isPublic: false,
      });
      setShowProjectModal(false);
      setNewProject({ title: "", description: "" });
      navigate(`/project/${response.data._id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProjects = projects.filter((project) => {
    const title = project.title?.toLowerCase() || "";
    const description = project.description?.toLowerCase() || "";
    return (
      title.includes(normalizedSearch) || description.includes(normalizedSearch)
    );
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        {/* <h1 className="dashboard-title">Dashboard</h1> */}
        <p className="dashboard-subtitle">Welcome back, {user?.name || user?.email}!</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalFiles}</div>
            <div className="stat-label">Files</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalNotes}</div>
            <div className="stat-label">Notes</div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-title">
            Recent Projects
            <div className="project-actions-right">
              <div className="project-search">
                <span className="search-icon">🔎</span>
                <input
                  type="text"
                  placeholder="Search projects by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="project-search-input"
                />
              </div>
              <button
                className="dashboard-button"
                onClick={() => setShowProjectModal(true)}
              >
                + New Project
              </button>
            </div>
          </div>
          {loading ? (
            <div className="dashboard-empty">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="dashboard-empty">
              {projects.length === 0
                ? "No projects yet. Create your first project to get started!"
                : "No projects match your search."}
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  noteCount={projectCounts[project._id]?.notes || 0}
                  fileCount={projectCounts[project._id]?.files || 0}
                />
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section about-section">
          <div className="dashboard-section-title">About CollabSphere</div>
          <p className="about-text">
            CollabSphere helps teams plan, build, and document projects in one place. Track
            files and notes, manage team members, and keep everything organized with a clean,
            fast workflow.
          </p>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon">⚡</div>
              <h3>Fast Collaboration</h3>
              <p>Invite members, share updates, and stay in sync with live project info.</p>
            </div>
            <div className="about-card">
              <div className="about-icon">📌</div>
              <h3>Project Clarity</h3>
              <p>Keep notes, files, and details together so nothing gets lost.</p>
            </div>
            <div className="about-card">
              <div className="about-icon">🧠</div>
              <h3>AI Assist</h3>
              <p>Generate explanations, docs, and READMEs to move faster.</p>
            </div>
          </div>
        </div>

      </div>

      {showProjectModal && (
        <div className="modal-backdrop" onClick={() => setShowProjectModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Project</h3>
            <p className="modal-subtitle">Add a title and description to get started.</p>
            <div className="modal-form">
              <input
                type="text"
                placeholder="Project title"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({ ...newProject, title: e.target.value })
                }
                className="modal-input"
              />
              <textarea
                placeholder="Project description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="modal-textarea"
                rows="4"
              />
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleNewProject}>
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;