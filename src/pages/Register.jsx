import React from 'react'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: ""
  });

  const [error, setError] = useState('');

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

 const {register} = useAuth();
const navigate = useNavigate();
 const handleSubmit = async (e) => {
  e.preventDefault();
    // setError(''); setSuccess('');
    // const validationError = validate();
    // if (validationError) { setError(validationError); return; }

    // setLoading(true);
    // await new Promise(r => setTimeout(r, 600)); // Simulate network latency
  const res = register({
    email: form.email,
    password: form.password,
    firstName: form.firstName,
    lastName: form.fastName,
    role: form.role
  });
  if(res){
    navigate('/login');
  } else {
    console.log("Registration failed")  
  }
 }
  return (
    <div>
      <form action="" >
        <input type="text" placeholder='First Name' onChange={e => set('FirstName', e.target.value)} value={form.firstName}/>
        <input type="text" placeholder='Last Name' onChange={e => set('LastName', e.target.value)} value={form.lastName}/>
        <input type="text" placeholder='email' onChange={e => set('email', e.target.value)} value={form.email}/>
        <input type="password" placeholder='password' onChange={e => set('password', e.target.value)} value={form.password}/>
        <input type="text" placeholder='role' onChange={e => set('role', e.target.value)} value={form.role}/>
        <button type='submit' onClick={handleSubmit}>Register</button>
      </form>
    </div>
  )
}

export default Register