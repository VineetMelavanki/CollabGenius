import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Homepage from './pages/Homepage';
import Login from './pages/LoginPage';
import Register from "./pages/Register";
import CreateTeam from './pages/CreateTeam';
import Dashboard from './pages/Dashboard';
import Totalteams from './pages/Totalteams';
export default function App()
{
return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Homepage/>} />
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/CreateTeam" element={<CreateTeam/>}/>
    <Route path="/allteams" element={<Totalteams/>}/>
  </Routes>
  </BrowserRouter>
)
}