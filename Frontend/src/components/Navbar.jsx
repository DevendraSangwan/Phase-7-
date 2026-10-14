import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Navbar.css";

const Navbar = ({ theme, setTheme }) => {
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand-wrap">
          {/* <span className="brand-mark">C</span> */}
          <span className="navbar-brand">CollabSphere</span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <span className="navbar-user">{user.name}</span>
              <button onClick={logout} className="navbar-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-pressed={theme === "dark"}
          >
            <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;