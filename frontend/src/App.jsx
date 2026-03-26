import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Homepage from './pages/Homepage';
import Login from './pages/LoginPage';
import Register from "./pages/Register";
import ViewProfile from './pages/ViewProfile';
import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/CreateProfile';
import About from './pages/About';
import Navbar from './pages/navbar';
import CreateProject from './pages/CreateProject';
import DashBoardLayout from './pages/DashBoardLayout';
import Allprojects from './pages/allprojects';
import Projectdetails from './pages/Projectdetails';
import Getyourprojects from './pages/getyourprojects';
import Allusers from './pages/Getallusers';
import Notifications from './pages/Notifications';
import ViewIndiProfile from './pages/ViewIndiProfile';
export default function App()
{
return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Homepage/>} />
    <Route path="/login" element={
  <Login/>}/>
    <Route path="/register" element={
      <Register/>}/>
    <Route path="/View-Profile" element={
      <DashBoardLayout>
      <ViewProfile/>
      </DashBoardLayout>
      }/>
      <Route path='/About' element={
         <Navbar>
          <About/>
          </Navbar>
      }/>
    <Route path='/Create-Profile' element={
      <DashBoardLayout>
      <CreateProfile/>
      </DashBoardLayout>
      }/>
     <Route path='/Create-Project' element={
      <DashBoardLayout>
        <CreateProject/>
      </DashBoardLayout>
     }/>
      <Route path='/dashboard' element={
        <DashBoardLayout>
          <Dashboard/>
        </DashBoardLayout>}/>
        <Route path='/getallprojects' element={
          <DashBoardLayout>
            <Allprojects/>
          </DashBoardLayout>
        }/>
        <Route path='/get-project/:projectId' element={
          <DashBoardLayout>
            <Projectdetails/>
          </DashBoardLayout>
        }/>
        <Route path='/your-projects' element={
          <DashBoardLayout>
            <Getyourprojects/>
          </DashBoardLayout>
        }/>
        <Route path='/view-profile/:id' element={
          <DashBoardLayout>
            <ViewIndiProfile/>
            </DashBoardLayout>
        }
        />
        <Route path='/allusers' element={
          <DashBoardLayout>
            <Allusers/>
            </DashBoardLayout>
        }/>
        <Route path='/Notifications' element={
          <DashBoardLayout>
            <Notifications/>
            </DashBoardLayout>
        }/>
  </Routes>
  </BrowserRouter>
)
}