import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import AIShowcasePreview from "../components/AIShowcasePreview";
import "../styles/Auth.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      const { data } = await registerUser(form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
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
          <div className="auth-badge">Start your workspace</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">
            Build projects, invite teammates, and turn ideas into organized collaboration in minutes.
          </p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Full Name"
              className="auth-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
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
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <div className="auth-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-card">
            <h3>Collaborate without the clutter</h3>
            <p>
              One home for project files, notes, and members. Keep every update in sync and
              ship faster.
            </p>
            <div className="auth-panel-stats">
              <div>
                <span className="stat">Secure</span>
                <span className="label">Access</span>
              </div>
              <div>
                <span className="stat">Smart</span>
                <span className="label">Docs</span>
              </div>
              <div>
                <span className="stat">Fast</span>
                <span className="label">Setup</span>
              </div>
            </div>
          </div>
          <div className="auth-panel-card">
            <h4>Perfect for teams</h4>
            <ul>
              <li>Start projects with a single click</li>
              <li>Invite teammates by email</li>
              <li>Generate README & docs instantly</li>
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

export default Register;