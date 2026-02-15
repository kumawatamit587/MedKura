import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../assets/css/Login_css";
export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await signup(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setFormData({ email: "", password: "" });
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🏥</div>
            <span style={styles.logoText}>MedTrack</span>
          </div>

          <h1 style={styles.heroTitle}>
            Medical Report
            <br />
            Management
            <br />
            System
          </h1>

          <p style={styles.heroDesc}>
            Upload, track, and review your medical reports with real-time status
            updates and AI-generated summaries.
          </p>

          <div style={styles.features}>
            {["Secure Storage", "Real-time Tracking", "AI Summaries"].map(
              (feature) => (
                <div key={feature} style={styles.feature}>
                  <span style={styles.featureIcon}>✓</span>
                  <span>{feature}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p style={styles.formSubtitle}>
              {isSignup
                ? "Sign up to get started with MedTrack"
                : "Sign in to your account"}
            </p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#EF4444"
                  strokeWidth="2"
                />
                <path
                  d="M12 8v4M12 16h.01"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@hospital.com"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={isSignup ? 6 : undefined}
                  style={{ ...styles.input, paddingRight: 50 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.showPasswordBtn}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {isSignup && (
                <p style={styles.hint}>Must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <div style={styles.spinner} />
                  {isSignup ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                <>{isSignup ? "Create Account" : "Sign In"}</>
              )}
            </button>
          </form>

          <div style={styles.toggleContainer}>
            <span style={styles.toggleText}>
              {isSignup ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button type="button" onClick={toggleMode} style={styles.toggleBtn}>
              {isSignup ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
