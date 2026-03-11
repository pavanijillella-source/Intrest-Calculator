 import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "../context/HistoryContext";

export default function HistoryPanel({ onSelect }) {
  const { history, deleteFromHistory, clearAllHistory } = useHistory();

  if (history.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "36px" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🕓</div>
        <div className="section-label">NO HISTORY YET</div>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Your saved calculations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="section-label" style={{ margin: 0 }}>SAVED HISTORY</div>
        <button className="btn-ghost"
          style={{ height: 36, padding: "0 16px", fontSize: 13 }}
          onClick={clearAllHistory}>
          Clear All
        </button>
      </div>

      <AnimatePresence>
        {history.map((item) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => onSelect(item)}
            style={{
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "16px 20px",
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            whileHover={{ borderColor: "var(--accent)", scale: 1.01 }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <span style={{
                  background: "var(--accent-dim)",
                  border: "1px solid var(--border-active)",
                  color: "var(--accent)",
                  fontSize: 11, fontWeight: 600,
                  padding: "2px 10px", borderRadius: 20,
                  letterSpacing: 1,
                }}>
                  {item.type?.toUpperCase()}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{item.timestamp}</span>
              </div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <span style={{ color: "var(--text-sub)", fontSize: 14 }}>
                  Principal: <strong style={{ color: "#fff" }}>{item.currency}{item.principal?.toLocaleString()}</strong>
                </span>
                <span style={{ color: "var(--text-sub)", fontSize: 14 }}>
                  Rate: <strong style={{ color: "#fff" }}>{item.rate}%</strong>
                </span>
                <span style={{ color: "var(--text-sub)", fontSize: 14 }}>
                  Time: <strong style={{ color: "#fff" }}>{item.time} yrs</strong>
                </span>
                <span style={{ color: "var(--text-sub)", fontSize: 14 }}>
                  Total: <strong style={{ color: "var(--green)" }}>{item.currency}{item.total?.toLocaleString()}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); deleteFromHistory(item.id); }}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text-muted)",
                width: 36, height: 36,
                cursor: "pointer",
                fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff6b6b"; e.currentTarget.style.color = "#ff6b6b"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            >✕</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}