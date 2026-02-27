import React, { useState, useRef } from "react";
import "./App.css"; 
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const CURRENCIES = ["₹", "$", "€", "£"];
const FREQ_OPTIONS = [
  { label: "Monthly", value: 12 },
  { label: "Quarterly", value: 4 },
  { label: "Semi-Annual", value: 2 },
  { label: "Annual", value: 1 },
];

const CustomTooltip = ({ active, payload, currency }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "#16161f",
        border: "1px solid #c9a84c",
        borderRadius: 8,
        padding: "10px 16px",
        color: "#ffffff",
        fontSize: 13,
        fontFamily: "'Cormorant Garamond', serif",
      }}>
        <div style={{ color: "#7c6ff7", marginBottom: 4 }}>{payload[0]?.payload?.year}</div>
        <div>{currency}{Number(payload[0]?.value).toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

export default function App() {
  const [type, setType] = useState("compound");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState(12);
  const [currency, setCurrency] = useState("₹");
  const [result, setResult] = useState(null);
  const [yearlyData, setYearlyData] = useState([]);
  const resultRef = useRef(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    if (!p || !r || !t) return;

    let interest = 0, total = 0, breakdown = [];

    if (type === "simple") {
      interest = p * r * t;
      total = p + interest;
      for (let i = 1; i <= t; i++)
        breakdown.push({ year: `Y${i}`, amount: +(p + p * r * i).toFixed(2) });
    } else {
      const n = frequency;
      total = p * Math.pow(1 + r / n, n * t);
      interest = total - p;
      for (let i = 1; i <= t; i++)
        breakdown.push({ year: `Y${i}`, amount: +(p * Math.pow(1 + r / n, n * i)).toFixed(2) });
    }

    setYearlyData(breakdown);
    setResult({ principal: p, interest: +interest.toFixed(2), total: +total.toFixed(2) });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const reset = () => {
    setPrincipal(""); setRate(""); setTime("");
    setResult(null); setYearlyData([]);
  };

  const growthPct = result ? ((result.interest / result.principal) * 100).toFixed(1) : 0;
  const pieData = result
    ? [{ name: "Principal", value: result.principal }, { name: "Interest", value: result.interest }]
    : [];

  return (
    <div className="root">
      {/* Background decoration */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      <motion.div
        className="wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="site-header">
          <div className="logo-mark">⬡</div>
          <div>
            <h1 className="site-title">INTREST</h1>
            <p className="site-sub">CALCULATOR</p>
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Type Toggle */}
          <div className="section-label">CALCULATION MODE</div>
          <div className="toggle-row">
            {["simple", "compound"].map((t) => (
              <button
                key={t}
                className={`toggle-btn ${type === t ? "active" : ""}`}
                onClick={() => setType(t)}
              >
                {t === "simple" ? "Simple Interest" : "Compound Interest"}
              </button>
            ))}
          </div>

          {/* Currency */}
          <div className="section-label" style={{ marginTop: 28 }}>CURRENCY</div>
          <div className="currency-row">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                className={`curr-btn ${currency === c ? "active" : ""}`}
                onClick={() => setCurrency(c)}
              >{c}</button>
            ))}
          </div>

          {/* Inputs */}
          <div className="section-label" style={{ marginTop: 28 }}>PARAMETERS</div>
          <div className="inputs-grid">
            <div className="input-group">
              <label>Principal Amount</label>
              <div className="input-wrap">
                <span className="input-prefix">{currency}</span>
                <input type="number" placeholder="0.00" value={principal} onChange={e => setPrincipal(e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label>Annual Rate</label>
              <div className="input-wrap">
                <input type="number" placeholder="0.00" value={rate} onChange={e => setRate(e.target.value)} />
                <span className="input-suffix">%</span>
              </div>
            </div>
            <div className="input-group">
              <label>Duration</label>
              <div className="input-wrap">
                <input type="number" placeholder="0" value={time} onChange={e => setTime(e.target.value)} />
                <span className="input-suffix">YRS</span>
              </div>
            </div>
            {type === "compound" && (
              <div className="input-group">
                <label>Compounding</label>
                <select value={frequency} onChange={e => setFrequency(Number(e.target.value))}>
                  {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="actions">
            <motion.button className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={calculate}>
              <span>Calculate Returns</span>
              <span className="btn-arrow">→</span>
            </motion.button>
            <motion.button className="btn-ghost" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={reset}>
              Clear
            </motion.button>
          </div>
        </motion.div>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultRef}
              className="result-card"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.7 }}
            >
              {/* Top metrics */}
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

              {/* Charts */}
              <div className="charts-row">
                <div className="chart-panel">
                  <div className="chart-title">ALLOCATION BREAKDOWN</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                        <Cell fill="#7c6ff7" />
                        <Cell fill="#34d399" />
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <div style={{ background: "#16161f", border: "1px solid #c9a84c", borderRadius: 6, padding: "8px 12px", color: "#ffffff", fontSize: 12 }}>
                              <div>{payload[0].name}</div>
                              <div style={{ color: "#7c6ff7" }}>{currency}{Number(payload[0].value).toLocaleString()}</div>
                            </div>
                          ) : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="legend">
                    <span><span className="dot gold-dot" />Principal</span>
                    <span><span className="dot green-dot" />Interest</span>
                  </div>
                </div>

                <div className="chart-panel grow">
                  <div className="chart-title">GROWTH TRAJECTORY</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={yearlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c6ff7" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#7c6ff7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b6b6b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${currency}${(v/1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip currency={currency} />} />
                      <Area type="monotone" dataKey="amount" stroke="#7c6ff7" strokeWidth={2} fill="url(#areaGrad)" dot={false} activeDot={{ r: 5, fill: "#c9a84c", strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="insight-bar">
                <span className="insight-icon">◆</span>
                <span>
                  {type === "compound" ? "Compound" : "Simple"} interest at <strong>{rate}%</strong> over <strong>{time} years</strong>
                  {" "}multiplies your wealth by <strong>{(result.total / result.principal).toFixed(2)}×</strong>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}