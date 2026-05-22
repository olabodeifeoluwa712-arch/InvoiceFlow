import React from 'react'
import { useAuth } from '../Context/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };
    const handleLogin = (e) => {
        e.preventDefault();
     let res = login({
        email: form.email,
        password: form.password
      });
      if(res){
        navigate('/');
      }
    };
  return (
    <>
        <input type="text" onChange={(e) => set('email', e.target.value)} value={form.email} placeholder="Email"/>
        <input type="password" onChange={(e) => set('password', e.target.value)} value={form.password} placeholder="Password"/>
        <button onClick={handleLogin}>Login</button>
    </>
  )
}

export default login