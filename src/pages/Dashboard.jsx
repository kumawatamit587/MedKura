import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReportCard from "../components/ReportCard";
import api from "../api/axios";
import styles from "../assets/css/Dashboard";

const STATUS_FILTERS = ["ALL", "UPLOADED", "PROCESSING", "COMPLETED"];

const STAT_CARDS = [
  { key: "total", label: "Total Reports", color: "#1D4ED8", icon: "📋" },
  { key: "UPLOADED", label: "Uploaded", color: "#3B82F6", icon: "↑" },
  { key: "PROCESSING", label: "Processing", color: "#F59E0B", icon: "⟳" },
  { key: "COMPLETED", label: "Completed", color: "#10B981", icon: "✓" },
];

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/reports");
      setReports(res.data);
    } catch (err) {
      let errorMessage = "Failed to load reports. Please try again.";

      if (err.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
        // Navigate to login
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Backend server may not be responding.";
      } else if (!err.response) {
        errorMessage = "Cannot connect to server. Is the backend running?";
      }

      setError(errorMessage);
      console.error("Fetch reports error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: reports.length,
    UPLOADED: reports.filter((r) => r.status === "UPLOADED").length,
    PROCESSING: reports.filter((r) => r.status === "PROCESSING").length,
    COMPLETED: reports.filter((r) => r.status === "COMPLETED").length,
  };

  const filtered = reports.filter((r) => {
    const matchesFilter = filter === "ALL" || r.status === filter;
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Reports Dashboard</h1>
            <p style={styles.subtitle}>
              View and manage all uploaded medical reports
            </p>
          </div>
          <button
            style={styles.uploadBtn}
            onClick={() => navigate("/upload")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-1px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12l7-7 7 7"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Upload Report
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {STAT_CARDS.map((s) => (
            <div
              key={s.key}
              style={{ ...styles.statCard, borderTopColor: s.color }}
            >
              <div style={styles.statTop}>
                <span style={styles.statIcon}>{s.icon}</span>
                <span style={{ ...styles.statNum, color: s.color }}>
                  {stats[s.key]}
                </span>
              </div>
              <p style={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div style={styles.toolbar}>
          <div style={styles.filterGroup}>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  ...styles.chip,
                  ...(filter === f ? styles.chipActive : {}),
                }}
              >
                {f === "ALL"
                  ? "All Reports"
                  : f.charAt(0) + f.slice(1).toLowerCase()}
                {f !== "ALL" && (
                  <span
                    style={{
                      ...styles.chipCount,
                      ...(filter === f ? styles.chipCountActive : {}),
                    }}
                  >
                    {stats[f]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div style={styles.searchWrap}>
            <svg
              style={styles.searchIcon}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="11" cy="11" r="8" stroke="#94A3B8" strokeWidth="2" />
              <path
                d="m21 21-4.35-4.35"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#1D4ED8")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
            />
          </div>
        </div>

        {/* Reports List */}
        {error && (
          <div style={styles.errorBox}>
            {error}
            <button onClick={fetchReports} style={styles.retryBtn}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div style={styles.loadingWrap}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={styles.skeleton} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3 style={styles.emptyTitle}>No reports found</h3>
            <p style={styles.emptyDesc}>
              {search
                ? "Try adjusting your search or filter."
                : "Upload your first medical report to get started."}
            </p>
            {!search && (
              <button
                style={styles.emptyBtn}
                onClick={() => navigate("/upload")}
              >
                Upload Report
              </button>
            )}
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%{background-position:-200px 0} 100%{background-position:200px 0} }
      `}</style>
    </div>
  );
}
