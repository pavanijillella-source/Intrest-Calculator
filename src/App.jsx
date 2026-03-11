 import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

import Header from "./Components/Header";
import InterestForm from "./Components/InterestForm";
import ResultCard from "./Components/ResultCard";
import HistoryPanel from "./Components/HistoryPanel";
import { calculateInterest } from "./utils/calculate";
import { useHistory } from "./context/HistoryContext";

export default function App() {
  const [result, setResult] = useState(null);
  const [yearlyData, setYearlyData] = useState([]); 
  const [lastInput, setLastInput] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const resultRef = useRef(null);
  const { addToHistory } = useHistory();

  const handleCalculate = ({ type, principal, rate, time, frequency, currency }) => {
    const res = calculateInterest(type, principal, rate, time, frequency);
    if (!res) return;
    setResult(res);
    setYearlyData(res.breakdown);
    setLastInput({ type, rate, time, currency, frequency });

    // Auto-save to history
    addToHistory({
      type,
      currency,
      rate,
      time,
      frequency,
      principal: res.principal,
      total: res.total,
      interest: res.interest,
    });

    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleReset = () => {
    setResult(null);
    setYearlyData([]);
    setPrefill(null);
  };

  // When history item clicked — fill inputs and show output
  const handleHistorySelect = (item) => {
    const res = calculateInterest(item.type, item.principal, item.rate, item.time, item.frequency || 12);
    if (!res) return;
    setPrefill({
      type: item.type,
      principal: String(item.principal),
      rate: String(item.rate),
      time: String(item.time),
      frequency: item.frequency || 12,
      currency: item.currency,
    });
    setResult(res);
    setYearlyData(res.breakdown);
    setLastInput({
      type: item.type,
      rate: item.rate,
      time: item.time,
      currency: item.currency,
      frequency: item.frequency || 12,
    });
    setShowHistory(false);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  return (
    <div className="root">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <motion.div className="wrapper"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Header onToggleHistory={() => setShowHistory(prev => !prev)} showHistory={showHistory} />

        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.div key="calculator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <InterestForm
                  onCalculate={handleCalculate}
                  onReset={handleReset}
                  prefill={prefill}
                />
                <AnimatePresence>
                  {result && (
                    <motion.div ref={resultRef} key="result">
                      <ResultCard
                        result={result}
                        yearlyData={yearlyData}
                        currency={lastInput.currency}
                        type={lastInput.type}
                        rate={lastInput.rate}
                        time={lastInput.time}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HistoryPanel onSelect={handleHistorySelect} />
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}