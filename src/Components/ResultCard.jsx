import React, { useState } from "react";
import { motion } from "framer-motion";
import Charts from "./Charts";
import { useHistory } from "../context/HistoryContext";

export default function ResultCard({ result, yearlyData, currency, type, rate, time }) {
  const { saveToHistory } = useHistory();
  const growthPct = ((result.interest / result.principal) * 100).toFixed(1);

  const handleSave = () => {
    saveToHistory({
      type,
      currency,
      rate,
      time,
      principal: result.principal,
      interest: result.interest,
      total: result.total,
      growthPct,
    });
  };

  return (
    <motion.div
      className="result-card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.7 }}
    >
      {/* ── Top Metrics ── */}
      <div className="metrics-row">
        <div className="metric main-metric">
          <div className="metric-label">TOTAL VALUE</div>
          <div className="metric-value gold">{currency}{result.total.toLocaleString()}</div>
          <div className="metric-badge">+{growthPct}% growth</div>
        </div>
        <div className="metrics-side">
          <div className="metric">
            <div className="metric-label">PRINCIPAL</div>
            <div className="metric-value">{currency}{result.principal.toLocaleString()}</div>
          </div>
          <div className="divider-v" />
          <div className="metric">
            <div className="metric-label">INTEREST EARNED</div>
            <div className="metric-value accent">{currency}{result.interest.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="divider-h" />

      {/* ── Charts ── */}
      <Charts result={result} yearlyData={yearlyData} currency={currency} />

      {/* ── Insight ── */}
      <div className="insight-bar">
        <span className="insight-icon">◆</span>
        <span>
          {type === "compound" ? "Compound" : "Simple"} interest at <strong>{rate}%</strong> over{" "}
          <strong>{time} years</strong> multiplies your wealth by{" "}
          <strong>{(result.total / result.principal).toFixed(2)}×</strong>
        </span>
      </div>

      {/* ── Save to History ── */}
      <div className="actions" style={{ marginTop: 24 }}>
        <motion.button
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          style={{ background: "var(--green)", boxShadow: "0 4px 20px rgba(52,211,153,0.3)" }}
        >
          <span>Save to History</span>
          <span className="btn-arrow">＋</span>
        </motion.button>
      </div>
    </motion.div>
  );
}