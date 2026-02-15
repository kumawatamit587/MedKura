import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import styles from "../assets/css/UploadReport_css";

const REPORT_TYPES = [
  "Blood Test",
  "Radiology",
  "MRI",
  "CT Scan",
  "Ultrasound",
  "Pathology",
  "ECG",
  "Other",
];

export default function UploadReport() {
  const [form, setForm] = useState({ name: "", type: "", date: "" });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (f) => {
    const allowed = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/dicom",
    ];
    if (f && f.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB.");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("date", form.date);
      formData.append("file", file);

      await api.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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

        <div style={styles.card}>
          {/* Card header */}
          <div style={styles.cardHeader}>
            <div style={styles.headerIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                  stroke="#1D4ED8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="17 8 12 3 7 8"
                  stroke="#1D4ED8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="3"
                  x2="12"
                  y2="15"
                  stroke="#1D4ED8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h1 style={styles.cardTitle}>Upload Medical Report</h1>
              <p style={styles.cardSub}>
                Fill in the details and attach the report file
              </p>
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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
            {/* Report Name */}
            <div style={styles.field}>
              <label style={styles.label}>
                Report Name <span style={styles.required}>*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Blood Panel Report Q1"
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "#1D4ED8")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            {/* Two columns */}
            <div style={styles.twoCol}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Report Type <span style={styles.required}>*</span>
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  style={styles.select}
                  onFocus={(e) => (e.target.style.borderColor = "#1D4ED8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                >
                  <option value="">Select type...</option>
                  {REPORT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Report Date <span style={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  onFocus={(e) => (e.target.style.borderColor = "#1D4ED8")}
                  onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                />
              </div>
            </div>

            {/* File Drop Zone */}
            <div style={styles.field}>
              <label style={styles.label}>
                Report File <span style={styles.required}>*</span>
              </label>
              <div
                style={{
                  ...styles.dropZone,
                  ...(dragOver ? styles.dropZoneActive : {}),
                  ...(file ? styles.dropZoneHasFile : {}),
                }}
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.dcm"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />

                {file ? (
                  <div style={styles.fileInfo}>
                    <div style={styles.fileIcon}>
                      {file.type.includes("pdf") ? "📄" : "🖼️"}
                    </div>
                    <div>
                      <p style={styles.fileName}>{file.name}</p>
                      <p style={styles.fileSize}>
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      style={styles.removeFile}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div style={styles.dropContent}>
                    <div style={styles.dropIconWrap}>
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                          stroke="#94A3B8"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <polyline
                          points="17 8 12 3 7 8"
                          stroke="#94A3B8"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="12"
                          y1="3"
                          x2="12"
                          y2="15"
                          stroke="#94A3B8"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <p style={styles.dropTitle}>Drop your file here</p>
                    <p style={styles.dropSub}>
                      or <span style={styles.browseLink}>browse files</span>
                    </p>
                    <p style={styles.dropHint}>
                      PDF, PNG, JPG, DICOM · Max 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
              >
                {loading ? (
                  <span style={styles.btnLoader}>
                    <span style={styles.spinner} />
                    Uploading...
                  </span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <polyline
                        points="17 8 12 3 7 8"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="12"
                        y1="3"
                        x2="12"
                        y2="15"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Upload Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info note */}
        <div style={styles.infoNote}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#0EA5E9" strokeWidth="2" />
            <path
              d="M12 16v-4M12 8h.01"
              stroke="#0EA5E9"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          After upload, the report status will be set to{" "}
          <strong>UPLOADED</strong> and will move through{" "}
          <strong>PROCESSING → COMPLETED</strong> automatically.
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
