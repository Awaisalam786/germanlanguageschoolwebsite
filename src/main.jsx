import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GlobalContentProvider } from './context/GlobalContentContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalContentProvider>
      <App />
    </GlobalContentProvider>
  </React.StrictMode>,
)
