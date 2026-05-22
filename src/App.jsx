import React from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom'
import Login from './Pages/user/Login'
import Register from './Pages/user/Register'
import MainLayout from './components/Layout/MainLayout'
import { AuthProvider } from './Context/AuthContext'
function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </AuthProvider>

    </>
  )
}

export default App
