import { useState } from "react";

const FilePreview = ({ file, onDelete }) => {
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
  const imageExtensions = /\.(png|jpe?g|gif|webp|svg)$/i;
  const fileUrlPath = (file.fileUrl || "").split(/[?#]/, 1)[0];
  const isImage =
    imageExtensions.test(file.filename || "") ||
    imageExtensions.test(fileUrlPath);
  const fileType = (file.filename || "file").split(".").pop()?.toUpperCase() || "FILE";
  const fileSize = typeof file.size === "number"
    ? `${(file.size / 1024 / 1024).toFixed(file.size < 1024 * 1024 ? 1 : 2)} MB`
    : file.fileSize || "Unknown size";

  return (
    <div className="file-preview-card">
      <div className="file-preview-thumb">
        {isImage && !imagePreviewFailed ? (
          <img
            src={file.fileUrl}
            alt={file.filename}
            onError={() => setImagePreviewFailed(true)}
          />
        ) : (
          <div className="file-preview-placeholder">{fileType}</div>
        )}
      </div>

      <div className="file-preview-body">
        <div className="file-preview-header">
          <span className="file-preview-badge">{fileType}</span>
        </div>

        <h4>{file.filename}</h4>
        <p>Uploaded by {file.uploadedBy?.name || file.uploadedBy?.email || "team member"}</p>
        <span className="file-preview-size">{fileSize}</span>

        <div className="file-preview-actions">
          <a href={file.fileUrl} target="_blank" rel="noreferrer" className="file-link">
            View
          </a>
          <a href={file.fileUrl} download={file.filename} className="file-action-btn download">
            Download
          </a>
          {onDelete && (
            <button type="button" className="file-action-btn delete" onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;