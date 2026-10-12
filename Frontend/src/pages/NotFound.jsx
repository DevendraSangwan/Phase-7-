import { Link } from "react-router-dom";
import "../styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-code">404</div>
      <h1 className="not-found-title">Page Not Found</h1>
      <p className="not-found-message">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="not-found-button">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
