import { Link } from "react-router-dom";
import "../styles/ProjectCard.css";

const ProjectCard = ({ project, noteCount = 0, fileCount = 0 }) => {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <div>
          <h3 className="project-card-title">{project.title}</h3>
          <span className={`project-card-badge ${project.isPublic ? 'public' : 'private'}`}>
            {project.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>
      <p className="project-card-description">{project.description}</p>
      <div className="project-card-meta">
        <span className="project-card-meta-item">📁 {fileCount} files</span>
        <span className="project-card-meta-item">📝 {noteCount} notes</span>
      </div>
      <div className="project-card-actions">
        <Link to={`/project/${project._id}`} className="project-card-button primary">
          Open Project
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;