import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Login from './pages/LoginPage'
import Register from './pages/Register'
export default function App()
{
return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Homepage/>} />
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
  </Routes>
  </BrowserRouter>
)
}