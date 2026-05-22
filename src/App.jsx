import React from 'react'
import  './index.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext'
import MainLayout from './components/Layout/MainLayout'
import Register from './pages/Register'
import Login from './pages/Login'
function App() {
 

  return (
    <>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout/>} />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/contact" element={<h1>Contact</h1>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
      </AuthProvider>
    </>
  )
}

export default App
