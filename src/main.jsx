import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDom from 'react-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './Context/ThemeContext'

createRoot(document.getElementById('root')).render(
 
      <ThemeProvider>
    <App />
      </ThemeProvider>,
  
)
