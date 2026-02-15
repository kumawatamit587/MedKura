import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import styles from "../assets/css/ReportDetails_css";

const STATUS_CONFIG = {
  UPLOADED: {
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    label: "Uploaded",
    step: 1,
  },
  PROCESSING: {
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    label: "Processing",
    step: 2,
  },
  COMPLETED: {
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    label: "Completed",
    step: 3,
  },
};

const STEPS = ["UPLOADED", "PROCESSING", "COMPLETED"];

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

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/${id}`);
      setReport(res.data);
    } catch (err) {
      setError("Report not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setStatusLoading(true);
    try {
      const res = await api.patch(`/reports/${id}/status`, {
        status: newStatus,
      });
      setReport(res.data.report || res.data);
      setError("");
    } catch (err) {
      console.error("Status update error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.loadingCenter}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading report...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div style={styles.page}>
        <Navbar />
        <main style={styles.main}>
          <div style={styles.errorState}>
            <div style={styles.errorIcon}>⚠️</div>
            <h3 style={styles.errorTitle}>{error || "Report not found"}</h3>
            <button
              onClick={() => navigate("/dashboard")}
              style={styles.backBtn}
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const status = STATUS_CONFIG[report.status] || STATUS_CONFIG.UPLOADED;
  const currentStep = STEPS.indexOf(report.status);
  const nextStatus = STEPS[currentStep + 1];

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        {/* Back */}
        <button style={styles.back} onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M12 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Dashboard
        </button>

        {/* Page header */}
        <div style={styles.pageHeader}>
          <div style={styles.headerLeft}>
            <div style={styles.reportIcon}>
              {TYPE_ICONS[report.type] || "📄"}
            </div>
            <div>
              <h1 style={styles.reportName}>{report.name}</h1>
              <p style={styles.reportType}>{report.type}</p>
            </div>
          </div>
          <span
            style={{
              ...styles.statusBadge,
              color: status.color,
              background: status.bg,
              border: `1.5px solid ${status.border}`,
            }}
          >
            {status.label}
          </span>
        </div>

        {/* Progress stepper */}
        <div style={styles.stepper}>
          {STEPS.map((step, idx) => {
            const stepStatus = STATUS_CONFIG[step];
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            return (
              <div key={step} style={styles.stepItem}>
                <div
                  style={{
                    ...styles.stepCircle,
                    ...(isCompleted || isCurrent
                      ? {
                          background: stepStatus.color,
                          borderColor: stepStatus.color,
                          color: "#fff",
                        }
                      : {}),
                  }}
                >
                  {isCompleted ? "✓" : idx + 1}
                </div>
                <div style={styles.stepLabel}>
                  <span
                    style={{
                      ...styles.stepName,
                      ...(isCurrent
                        ? { color: stepStatus.color, fontWeight: 700 }
                        : {}),
                    }}
                  >
                    {stepStatus.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    style={{
                      ...styles.stepLine,
                      background: isCompleted ? "#10B981" : "#E2E8F0",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div style={styles.grid}>
          {/* Metadata card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Report Details</h2>
            <div style={styles.metaList}>
              {[
                { label: "Report ID", value: `#${report.id}` },
                { label: "Report Name", value: report.name },
                { label: "Report Type", value: report.type },
                { label: "Status", value: status.label },
                { label: "Uploaded At", value: formatDate(report.created_at) },

                { label: "File Path", value: report.file_path },
              ].map((item) => (
                <div key={item.label} style={styles.metaRow}>
                  <span style={styles.metaKey}>{item.label}</span>
                  <span style={styles.metaVal}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Status action */}
            {nextStatus && (
              <div style={styles.actionArea}>
                <p style={styles.actionLabel}>Move to next stage:</p>
                <button
                  onClick={() => handleStatusUpdate(nextStatus)}
                  disabled={statusLoading}
                  style={{
                    ...styles.actionBtn,
                    opacity: statusLoading ? 0.7 : 1,
                  }}
                >
                  {statusLoading ? (
                    <span style={styles.btnLoader}>
                      <span style={styles.spinnerSmall} />
                      Updating...
                    </span>
                  ) : (
                    <>
                      Mark as {STATUS_CONFIG[nextStatus].label}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 18l6-6-6-6"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Summary card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Generated Summary</h2>
            {report.status === "COMPLETED" && report.summary ? (
              <div style={styles.summaryBox}>
                <div style={styles.summaryHeader}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 11l3 3L22 4"
                      stroke="#059669"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                      stroke="#059669"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span style={styles.summaryReady}>Analysis Complete</span>
                </div>
                <p style={styles.summaryText}>{report.summary}</p>
              </div>
            ) : report.status === "PROCESSING" ? (
              <div style={styles.pendingBox}>
                <div style={styles.processingAnim}>
                  <div style={styles.processingDot} />
                  <div
                    style={{ ...styles.processingDot, animationDelay: "0.2s" }}
                  />
                  <div
                    style={{ ...styles.processingDot, animationDelay: "0.4s" }}
                  />
                </div>
                <p style={styles.pendingTitle}>Processing Report...</p>
                <p style={styles.pendingDesc}>
                  The AI is analyzing your report. Summary will appear here once
                  completed.
                </p>
              </div>
            ) : (
              <div style={styles.pendingBox}>
                <div style={styles.pendingIcon}>📋</div>
                <p style={styles.pendingTitle}>Awaiting Processing</p>
                <p style={styles.pendingDesc}>
                  Summary will be generated once the report enters the
                  processing stage.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-6px); opacity: 1; } }
      `}</style>
    </div>
  );
}
