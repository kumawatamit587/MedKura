import { useNavigate } from "react-router-dom";
import styles from "../assets/css/ReportCard_css";

const STATUS_CONFIG = {
  UPLOADED: {
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    dot: "#3B82F6",
    label: "Uploaded",
  },
  PROCESSING: {
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    dot: "#F59E0B",
    label: "Processing",
  },
  COMPLETED: {
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    dot: "#10B981",
    label: "Completed",
  },
};

const TYPE_ICONS = {
  "Blood Test": "🩸",
  Radiology: "🫁",
  MRI: "🧠",
  "CT Scan": "💉",
  Ultrasound: "🔊",
  Pathology: "🔬",
  ECG: "📈",
  Other: "📄",
};

export default function ReportCard({ report }) {
  const navigate = useNavigate();
  const status = STATUS_CONFIG[report.status] || STATUS_CONFIG.UPLOADED;
  const icon = TYPE_ICONS[report.type] || "📄";

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/reports/${report.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      <div style={styles.left}>
        <div style={styles.iconWrap}>{icon}</div>
        <div style={styles.info}>
          <p style={styles.name}>{report.name}</p>
          <p style={styles.meta}>
            {report.type} &nbsp;·&nbsp; Uploaded {formatDate(report.created_at)}
          </p>
        </div>
      </div>

      <div style={styles.right}>
        <span
          style={{
            ...styles.badge,
            color: status.color,
            background: status.bg,
            border: `1px solid ${status.border}`,
          }}
        >
          <span
            style={{
              ...styles.dot,
              background: status.dot,
              ...(report.status === "PROCESSING" ? styles.dotPulse : {}),
            }}
          />
          {status.label}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: "#94A3B8", marginLeft: 8 }}
        >
          <path
            d="M9 18l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
