import React from 'react'
import  './index.css'
import{BrowserRoute as Router,Routes,Route,} from 'react-router-dom'
import{Audit}from './Pages/Audit'
import{Catalogue}from './Pages/Catalogue'
import{Customers}from './Pages/Customers'
import{Dashboard}from './Pages/Dashboard'
import{Invoice}from './pages/Invoice'
import{Notifications}from './Pages/Notifications'
import{Orders}from './Pages/Orders'
import{Payments}from './Pages/Payments'
import{Receipt}from './Pages/Receipt'
import{Records}from './Pages/Records'
import{Register}from './Pages/Register'
import{Reports}from './Pages/Reports'
import{Sales}from './Pages/Sales'
import{Stocks}from './Pages/Stocks'
function App() {
 
  return (
    <>
     <Router>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/invoice' element={<Invoice/>}/>
        <Route path='/audit' element={<Audit/>}/>
        <Route path='/ catalogue' element={<Catalogue/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/invoice' element={<Invoice/>}/>
        <Route path='/Notifications' element={<Notifications/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/payments' element={<Payments/>}/>
        <Route path='/receipts' element={<Receipt/>}/>
        <Route path='/records' element={<Records/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/reports' element={<Reports/>}/>
        <Route path='/sales' element={<Sales/>}/>
        <Route path='/stocks' element={<Stocks/>}/>
      </Routes>
      </Router> 
    </>
  )
}

export default App
