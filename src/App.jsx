 import React, { useState, useEffect } from "react";
import "./App.css";
import { db, auth, provider } from "./firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function App() {
  // --- STATE ---
  const [type, setType] = useState("simple");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState(12);
  const [currency, setCurrency] = useState("₹");
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  // --- AUTH & HISTORY LISTENER ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Real-time listener for history
        const q = query(
          collection(db, "calculations"),
          where("userId", "==", currentUser.uid),
          orderBy("timestamp", "desc")
        );
        // Using onSnapshot for instant updates
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setHistory(data);
        });
        return () => unsubscribeSnapshot();
      } else {
        setHistory([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // --- ACTIONS ---
  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login Failed:", err);
      alert("Login failed! Check console.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setResult(null); 
  };

  const calculate = async () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (!p || !r || !t) {
      alert("Please enter valid numbers!");
      return;
    }

    let interest = 0;
    let total = 0;

    if (type === "simple") {
      interest = p * r * t;
      total = p + interest;
    } else {
      const n = parseInt(frequency);
      total = p * Math.pow(1 + r / n, n * t);
      interest = total - p;
    }

    const newResult = {
      interest: parseFloat(interest.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      principal: p
    };

    setResult(newResult);

    // Save to Firestore if logged in
    if (user) {
      try {
        await addDoc(collection(db, "calculations"), {
          userId: user.uid,
          type,
          principal: p,
          rate: parseFloat(rate),
          time: t,
          frequency,
          interest: newResult.interest,
          total: newResult.total,
          currency,
          timestamp: new Date(),
        });
      } catch (err) {
        console.error("Error saving history:", err);
      }
    }
  };

  const reset = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setResult(null);
  };

  const COLORS = ["#00C49F", "#FFBB28"]; // Green for Principal, Yellow for Interest

  return (
    <div className="dashboard-container">
      
      {/* --- LEFT SIDEBAR (The 3 Circles) --- */}
      <div className="sidebar">
        
        {/* 1. LOGIN SECTION */}
        <div className="sidebar-box user-section">
          <h2>👤 User Profile</h2>
          {user ? (
            <>
              {/* --- HERE IS THE FIXED PURPLE IMAGE FOR EVERYONE --- */}
              <img 
                src="https://image.shutterstock.com/image-vector/purple-user-icon-thin-line-profile-260nw-1286797516.jpg" 
                alt="Profile" 
                className="user-avatar" 
              />
              <h3>{user.displayName}</h3>
              <button className="login-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="login-btn" onClick={login}>Login with Google</button>
          )}
        </div>

        {/* 2. HISTORY SECTION */}
        {user && (
          <div className="sidebar-box history-section">
            <h2>📜 History</h2>
            {history.length === 0 ? <p>No calculations yet.</p> : null}
            {history.map((h) => (
              <div key={h.id} className="history-item">
                <strong>{h.type.toUpperCase()}</strong> <br/>
                {h.currency}{h.principal} @ {h.rate}% <br/>
                Interest: {h.currency}{h.interest}
              </div>
            ))}
          </div>
        )}

        {/* 3. CHARTS SECTION */}
        {result && (
          <div className="sidebar-box chart-section">
            <h2>📊 Visuals</h2>
            
            {/* Pie Chart */}
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Principal", value: result.principal },
                      { name: "Interest", value: result.interest }
                    ]}
                    cx="50%" cy="50%" innerRadius={40} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value"
                  >
                    {COLORS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div style={{ width: "100%", height: 200, marginTop: "20px" }}>
              <ResponsiveContainer>
                <BarChart data={[
                   { name: "Principal", amount: result.principal },
                   { name: "Total", amount: result.total }
                ]}>
                  <XAxis dataKey="name" stroke="white" />
                  <YAxis stroke="white" />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="amount" fill="#e096ee" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* --- RIGHT SIDE (Your Original Calculator) --- */}
      <div className="app">
        <h1>Interest Calculator</h1>

        {/* Toggle */}
        <div className="toggle">
          <button className={`toggle-btn ${type === "simple" ? "active" : ""}`} onClick={() => setType("simple")}>Simple</button>
          <button className={`toggle-btn ${type === "compound" ? "active" : ""}`} onClick={() => setType("compound")}>Compound</button>
        </div>

        {/* Inputs */}
        <input placeholder="Principal Amount" value={principal} onChange={(e) => setPrincipal(e.target.value)} type="number" />
        <input placeholder="Interest Rate (%)" value={rate} onChange={(e) => setRate(e.target.value)} type="number" />
        
        <div className="input-wrapper">
          <input placeholder="Time (Years)" value={time} onChange={(e) => setTime(e.target.value)} type="number" />
          <select className="mini-select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value={1}>Yearly</option>
            <option value={12}>Monthly</option>
            <option value={4}>Quarterly</option>
          </select>
        </div>

        {/* Currency */}
        <div className="currency">
          {["₹", "$", "€", "£"].map((c) => (
            <button key={c} className={currency === c ? "active" : ""} onClick={() => setCurrency(c)}>{c}</button>
          ))}
        </div>

        {/* Buttons */}
        <div className="buttons">
          <button className="action-btn" onClick={calculate}>Calculate</button>
          <button className="action-btn" onClick={reset}>Reset</button>
        </div>

        {/* Text Result */}
        {result && (
          <div className="result">
            <h3 className="total">Total: {currency}{result.total}</h3>
            <p className="intrest">Interest: {currency}{result.interest}</p>
          </div>
        )}
      </div>
    </div>
  );
}