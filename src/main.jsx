import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './bones/registry'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
