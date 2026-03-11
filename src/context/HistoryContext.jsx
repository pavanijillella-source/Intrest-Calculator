import React, { createContext, useContext, useState, useEffect } from "react";

const HistoryContext = createContext();

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("calc-history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("calc-history", JSON.stringify(history));
  }, [history]);

  const addToHistory = (entry) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      ...entry,
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const deleteFromHistory = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearAllHistory = () => setHistory([]);

  return (
    <HistoryContext.Provider value={{ history, addToHistory, deleteFromHistory, clearAllHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}