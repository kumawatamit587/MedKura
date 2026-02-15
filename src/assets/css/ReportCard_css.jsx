const styles = {
  card: {
    background: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: 14,
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  info: {},
  name: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    color: "#0F172A",
    fontFamily: "'Sora', sans-serif",
  },
  meta: {
    margin: "3px 0 0",
    fontSize: 13,
    color: "#94A3B8",
  },
  right: {
    display: "flex",
    alignItems: "center",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    display: "inline-block",
  },
  dotPulse: {
    animation: "pulse 1.5s ease-in-out infinite",
  },
};

export default styles;
