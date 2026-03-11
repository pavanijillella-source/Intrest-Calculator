 import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from "react-router-dom"
import { HistoryProvider } from './context/HistoryContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <HistoryProvider>
      <App />
    </HistoryProvider>
  </HashRouter>
)