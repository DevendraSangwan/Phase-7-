import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import AIShowcasePreview from "../components/AIShowcasePreview";
import "../styles/Auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const showcaseRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const { data } = await loginUser(form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const target = showcaseRef.current;
    if (!target) return;

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
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-badge">Welcome to CollabSphere</div>
          <h2 className="auth-title">Sign In</h2>
          <p className="auth-subtitle">
            Organize your work, share files, and collaborate with your team in one smooth workspace.
          </p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="auth-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-card">
            <h3>Project clarity, all in one workspace</h3>
            <p>
              Track notes, share files, and add members instantly. CollabSphere keeps your
              workflow organized and your team aligned.
            </p>
            <div className="auth-panel-stats">
              <div>
                <span className="stat">24/7</span>
                <span className="label">Access</span>
              </div>
              <div>
                <span className="stat">1-Click</span>
                <span className="label">Invite</span>
              </div>
              <div>
                <span className="stat">AI</span>
                <span className="label">Assist</span>
              </div>
            </div>
          </div>
          <div className="auth-panel-card">
            <h4>What you can do</h4>
            <ul>
              <li>Create projects and assign members</li>
              <li>Store files and manage notes</li>
              <li>Generate docs and README with AI</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="auth-showcase" ref={showcaseRef}>
        <AIShowcasePreview />
        <div className="auth-showcase-text">
          <h2 className="auth-showcase-subtitle">Special feature</h2>
          <h3>How it works</h3>
          <p>
            Paste your code, choose the language, and instantly generate documentation,
            explain the code, or create a README file.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;