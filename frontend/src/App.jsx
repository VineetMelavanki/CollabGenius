import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Homepage from './Homepage'
import Login from './pages/LoginPage'
import Register from './Register'
import CreateTeam from './pages/CreateTeam'
export default function App()
{
return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Homepage/>} />
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/Createteam" element={<CreateTeam/>}/>
  </Routes>
  </BrowserRouter>
)
}