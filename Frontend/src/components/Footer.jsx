import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">CollabSphere</span>
          <p className="footer-tagline">Organize projects, files, notes, and AI tools in one place.</p>
        </div>
        <div className="footer-tips">
          <h4>Quick Tips</h4>
          <ul>
            <li>Create a project and invite teammates.</li>
            <li>Add notes for decisions and next steps.</li>
            <li>Upload files to keep resources centralized.</li>
            <li>Use AI tools to generate docs and README.</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} CollabSphere.Made with ❤️, errors and Tears 😭.</span>
      </div>
    </footer>
  );
};

export default Footer;
