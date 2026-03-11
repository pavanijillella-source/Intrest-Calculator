import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateEMI, calculateRealReturn, calculateGoalSIP } from "../utils/calculate";
import Charts from "./Charts";

const MODES = [
  { key: "emi", label: "EMI Calculator", icon: "◈" },
  { key: "real", label: "Real Return", icon: "◇" },
  { key: "sip", label: "Goal SIP", icon: "◉" },
];

export default function AdvancedCalculator({ currency }) {
  const [mode, setMode] = useState("emi");
  const [result, setResult] = useState(null);

  // EMI state
  const [emiPrincipal, setEmiPrincipal] = useState("");
  const [emiRate, setEmiRate] = useState("");
  const [emiTenure, setEmiTenure] = useState("");

  // Real Return state
  const [nominalRate, setNominalRate] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [realYears, setRealYears] = useState("");

  // Goal SIP state
  const [targetAmount, setTargetAmount] = useState("");
  const [sipRate, setSipRate] = useState("");
  const [sipYears, setSipYears] = useState("");

  const handleCalculate = () => {
    setResult(null);
    if (mode === "emi") {
      const res = calculateEMI(emiPrincipal, emiRate, emiTenure);
      if (res) setResult({ mode: "emi", ...res });
    } else if (mode === "real") {
      const res = calculateRealReturn(nominalRate, inflationRate, realYears);
      if (res) setResult({ mode: "real", ...res });
    } else if (mode === "sip") {
      const res = calculateGoalSIP(targetAmount, sipRate, sipYears);
      if (res) setResult({ mode: "sip", ...res });
    }
  };

  const handleClear = () => {
    setResult(null);
    setEmiPrincipal(""); setEmiRate(""); setEmiTenure("");
    setNominalRate(""); setInflationRate(""); setRealYears("");
    setTargetAmount(""); setSipRate(""); setSipYears("");
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ color: "var(--accent)", fontSize: 18 }}>⬡</span>
        <div>
          <div className="section-label" style={{ marginBottom: 0 }}>ADVANCED CALCULATOR</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>EMI · Real Returns · SIP Goal Planner</div>
        </div>
      </div>

      {/* ── Mode Toggle ── */}
      <div className="toggle-row" style={{ marginBottom: 28 }}>
        {MODES.map((m) => (
          <button
            key={m.key}
            className={`toggle-btn ${mode === m.key ? "active" : ""}`}
            onClick={() => { setMode(m.key); setResult(null); }}
            style={{ fontSize: 13 }}
          >
            <span style={{ marginRight: 6 }}>{m.icon}</span>{m.label}
          </button>
        ))}
      </div>

      {/* ── EMI Inputs ── */}
      {mode === "emi" && (
        <div className="inputs-grid">
          <div className="input-group">
            <label>Loan Amount</label>
            <div className="input-wrap">
              <span className="input-prefix">{currency}</span>
              <input type="number" placeholder="0.00" value={emiPrincipal} onChange={e => setEmiPrincipal(e.target.value)} />
            </div>
          </div>
          <div className="input-group">
            <label>Annual Interest Rate</label>
            <div className="input-wrap">
              <input type="number" placeholder="0.00" value={emiRate} onChange={e => setEmiRate(e.target.value)} />
              <span className="input-suffix">%</span>
            </div>
          </div>
          <div className="input-group">
            <label>Loan Tenure</label>
            <div className="input-wrap">
              <input type="number" placeholder="0" value={emiTenure} onChange={e => setEmiTenure(e.target.value)} />
              <span className="input-suffix">MONTHS</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Real Return Inputs ── */}
      {mode === "real" && (
        <div className="inputs-grid">
          <div className="input-group">
            <label>Nominal Rate</label>
            <div className="input-wrap">
              <input type="number" placeholder="0.00" value={nominalRate} onChange={e => setNominalRate(e.target.value)} />
              <span className="input-suffix">%</span>
            </div>
          </div>
          <div className="input-group">
            <label>Inflation Rate</label>
            <div className="input-wrap">
              <input type="number" placeholder="0.00" value={inflationRate} onChange={e => setInflationRate(e.target.value)} />
              <span className="input-suffix">%</span>
            </div>
          </div>
          <div className="input-group">
            <label>Duration</label>
            <div className="input-wrap">
              <input type="number" placeholder="0" value={realYears} onChange={e => setRealYears(e.target.value)} />
              <span className="input-suffix">YRS</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Goal SIP Inputs ── */}
      {mode === "sip" && (
        <div className="inputs-grid">
          <div className="input-group">
            <label>Target Amount</label>
            <div className="input-wrap">
              <span className="input-prefix">{currency}</span>
              <input type="number" placeholder="0.00" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} />
            </div>
          </div>
          <div className="input-group">
            <label>Expected Annual Return</label>
            <div className="input-wrap">
              <input type="number" placeholder="0.00" value={sipRate} onChange={e => setSipRate(e.target.value)} />
              <span className="input-suffix">%</span>
            </div>
          </div>
          <div className="input-group">
            <label>Time Horizon</label>
            <div className="input-wrap">
              <input type="number" placeholder="0" value={sipYears} onChange={e => setSipYears(e.target.value)} />
              <span className="input-suffix">YRS</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="actions">
        <motion.button className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCalculate}>
          <span>Calculate</span>
          <span className="btn-arrow">→</span>
        </motion.button>
        <motion.button className="btn-ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleClear}>
          Clear
        </motion.button>
      </div>

      {/* ── Results ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: 28 }}
          >
            <div className="divider-h" style={{ marginTop: 0 }} />

            {/* EMI Result */}
            {result.mode === "emi" && (
              <>
                <div className="metrics-row">
                  <div className="metric main-metric">
                    <div className="metric-label">MONTHLY EMI</div>
                    <div className="metric-value gold">{currency}{result.emi.toLocaleString()}</div>
                    <div className="metric-badge">Total: {currency}{result.totalPayment.toLocaleString()}</div>
                  </div>
                  <div className="metrics-side">
                    <div className="metric">
                      <div className="metric-label">PRINCIPAL</div>
                      <div className="metric-value">{currency}{result.principal.toLocaleString()}</div>
                    </div>
                    <div className="divider-v" />
                    <div className="metric">
                      <div className="metric-label">TOTAL INTEREST</div>
                      <div className="metric-value accent">{currency}{result.totalInterest.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <Charts
                  result={{ principal: result.principal, interest: result.totalInterest }}
                  yearlyData={result.breakdown}
                  currency={currency}
                />
                <div className="insight-bar" style={{ marginTop: 20 }}>
                  <span className="insight-icon">◆</span>
                  <span>
                    You pay <strong>{currency}{result.emi.toLocaleString()}/month</strong>. Total interest paid is{" "}
                    <strong>{((result.totalInterest / result.principal) * 100).toFixed(1)}%</strong> of the loan amount.
                  </span>
                </div>
              </>
            )}

            {/* Real Return Result */}
            {result.mode === "real" && (
              <>
                <div className="metrics-row">
                  <div className="metric main-metric">
                    <div className="metric-label">REAL RETURN RATE</div>
                    <div className="metric-value gold">{result.realRate}%</div>
                    <div className="metric-badge" style={{ background: result.realRate > 0 ? "var(--green-dim)" : "rgba(255,107,107,0.1)", color: result.realRate > 0 ? "var(--green)" : "#ff6b6b", borderColor: result.realRate > 0 ? "rgba(52,211,153,0.25)" : "rgba(255,107,107,0.25)" }}>
                      {result.realRate > 0 ? "Beating inflation ✓" : "Below inflation ✗"}
                    </div>
                  </div>
                  <div className="metrics-side">
                    <div className="metric">
                      <div className="metric-label">NOMINAL</div>
                      <div className="metric-value">{result.nominalRate}%</div>
                    </div>
                    <div className="divider-v" />
                    <div className="metric">
                      <div className="metric-label">INFLATION</div>
                      <div className="metric-value accent">{result.inflationRate}%</div>
                    </div>
                  </div>
                </div>
                <div className="insight-bar" style={{ marginTop: 20 }}>
                  <span className="insight-icon">◆</span>
                  <span>
                    After accounting for <strong>{result.inflationRate}% inflation</strong>, your actual purchasing power grows at{" "}
                    <strong>{result.realRate}% per year</strong> (Fisher Equation).
                  </span>
                </div>
              </>
            )}

            {/* SIP Goal Result */}
            {result.mode === "sip" && (
              <>
                <div className="metrics-row">
                  <div className="metric main-metric">
                    <div className="metric-label">MONTHLY SIP NEEDED</div>
                    <div className="metric-value gold">{currency}{result.monthlyInvestment.toLocaleString()}</div>
                    <div className="metric-badge">Goal: {currency}{result.target.toLocaleString()}</div>
                  </div>
                  <div className="metrics-side">
                    <div className="metric">
                      <div className="metric-label">TOTAL INVESTED</div>
                      <div className="metric-value">{currency}{result.totalInvested.toLocaleString()}</div>
                    </div>
                    <div className="divider-v" />
                    <div className="metric">
                      <div className="metric-label">GAINS</div>
                      <div className="metric-value accent">{currency}{result.totalGains.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <Charts
                  result={{ principal: result.totalInvested, interest: result.totalGains }}
                  yearlyData={result.breakdown}
                  currency={currency}
                />
                <div className="insight-bar" style={{ marginTop: 20 }}>
                  <span className="insight-icon">◆</span>
                  <span>
                    Investing <strong>{currency}{result.monthlyInvestment.toLocaleString()}/month</strong> will grow to your goal of{" "}
                    <strong>{currency}{result.target.toLocaleString()}</strong>. Markets contribute{" "}
                    <strong>{((result.totalGains / result.target) * 100).toFixed(1)}%</strong> of your target.
                  </span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}