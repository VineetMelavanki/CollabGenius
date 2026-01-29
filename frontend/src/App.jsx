import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Homepage from './pages/Homepage';
import Login from './pages/LoginPage';
import Register from "./pages/Register";
import CreateTeam from './pages/CreateTeam';
import ViewProfile from './pages/ViewProfile';
import ViewTeam from './pages/ViewTeam';
import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/CreateProfile';

import DashBoardLayout from './pages/DashBoardLayout';
export default function App()
{
return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Homepage/>} />
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    
    <Route path="/CreateTeam" element={
      <DashBoardLayout>
        <CreateTeam/>
      </DashBoardLayout>
      }/>
    <Route path="/View-Profile" element={
      <DashBoardLayout>
      <ViewProfile/>
      </DashBoardLayout>
      }/>
    <Route path='/Create-Profile' element={
      <DashBoardLayout>
      <CreateProfile/>
      </DashBoardLayout>
      }/>
    
      <Route path='/dashboard' element={
        <DashBoardLayout>
          <Dashboard/>
        </DashBoardLayout>}/>
        <Route path='/View-Team' element={
          <DashBoardLayout>
            <ViewTeam/>
          </DashBoardLayout>
        }/>
  </Routes>
  </BrowserRouter>
)
}