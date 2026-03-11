 import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CURRENCIES = ["₹", "$", "€", "£"];
const FREQ_OPTIONS = [
  { label: "Monthly", value: 12 },
  { label: "Quarterly", value: 4 },
  { label: "Semi-Annual", value: 2 },
  { label: "Annual", value: 1 },
];

export default function InterestForm({ onCalculate, onReset, prefill }) {
  const [type, setType] = useState("compound");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState(12);
  const [currency, setCurrency] = useState("₹");

  // When a history item is selected, prefill all inputs
  useEffect(() => {
    if (prefill) {
      setType(prefill.type);
      setPrincipal(prefill.principal);
      setRate(prefill.rate);
      setTime(prefill.time);
      setFrequency(prefill.frequency);
      setCurrency(prefill.currency);
    }
  }, [prefill]);

  const handleCalculate = () => {
    onCalculate({ type, principal, rate, time, frequency, currency });
  };

  const handleReset = () => {
    setPrincipal(""); setRate(""); setTime("");
    setType("compound"); setFrequency(12); setCurrency("₹");
    onReset();
  };

  return (
    <motion.div className="card"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <div className="section-label">CALCULATION MODE</div>
      <div className="toggle-row">
        {["simple", "compound"].map((t) => (
          <button key={t}
            className={`toggle-btn ${type === t ? "active" : ""}`}
            onClick={() => setType(t)}
          >
            {t === "simple" ? "Simple Interest" : "Compound Interest"}
          </button>
        ))}
      </div>

      <div className="section-label" style={{ marginTop: 28 }}>CURRENCY</div>
      <div className="currency-row">
        {CURRENCIES.map((c) => (
          <button key={c}
            className={`curr-btn ${currency === c ? "active" : ""}`}
            onClick={() => setCurrency(c)}
          >{c}</button>
        ))}
      </div>

      <div className="section-label" style={{ marginTop: 28 }}>PARAMETERS</div>
      <div className="inputs-grid">
        <div className="input-group">
          <label>Principal Amount</label>
          <div className="input-wrap">
            <span className="input-prefix">{currency}</span>
            <input type="number" placeholder="0.00" value={principal}
              onChange={e => setPrincipal(e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label>Annual Rate</label>
          <div className="input-wrap">
            <input type="number" placeholder="0.00" value={rate}
              onChange={e => setRate(e.target.value)} />
            <span className="input-suffix">%</span>
          </div>
        </div>
        <div className="input-group">
          <label>Duration</label>
          <div className="input-wrap">
            <input type="number" placeholder="0" value={time}
              onChange={e => setTime(e.target.value)} />
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

      <div className="actions">
        <motion.button className="btn-primary"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleCalculate}
        >
          <span>Calculate</span>
          <span className="btn-arrow">→</span>
        </motion.button>
        <motion.button className="btn-ghost"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleReset}
        >Clear</motion.button>
      </div>
    </motion.div>
  );
}