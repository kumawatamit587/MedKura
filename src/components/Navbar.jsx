import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../assets/css/Navbar_css";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Upload Report", path: "/upload" },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate("/dashboard")}>
        <div style={styles.logoIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span style={styles.brandText}>MedTrack</span>
      </div>

      <div style={styles.links}>
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              ...styles.navLink,
              ...(location.pathname === link.path ? styles.navLinkActive : {}),
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div style={styles.right}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <span style={styles.userName}>{user?.email}</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
}
