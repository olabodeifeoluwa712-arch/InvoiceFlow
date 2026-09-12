import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDom from 'react-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './Context/ThemeContext'
import { BusinessProvider } from './context/BusinessContext.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BusinessProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BusinessProvider>
    </AuthProvider>
  </StrictMode>

)
