 import React from "react";

export default function Header({ onToggleHistory, showHistory }) {
  return (
    <div className="site-header" style={{ justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="logo-mark">⬡</div>
        <div>
          <h1 className="site-title">INTEREST</h1>
          <p className="site-sub">CALCULATOR</p>
        </div>
      </div>
      <button
        className="btn-ghost"
        style={{ height: 40, padding: "0 20px", fontSize: 13, letterSpacing: 1 }}
        onClick={onToggleHistory}
      >
        {showHistory ? "← Calculator" : "🕓 History"}
      </button>
    </div>
  );
}