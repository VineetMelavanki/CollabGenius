import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Homepage from './pages/Homepage';
import Login from './pages/LoginPage';
import Register from "./pages/Register";
import ViewProfile from './pages/ViewProfile';
import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/CreateProfile';
import About from './pages/About';
import CreateProject from './pages/CreateProject';
import DashBoardLayout from './pages/DashBoardLayout';
import Allprojects from './pages/allprojects';
import Projectdetails from './pages/Projectdetails';
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
         <DashBoardLayout>
          <About/>
        </DashBoardLayout>
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
        <Route path='/get-project/:id' element={
          <DashBoardLayout>
            <Projectdetails/>
          </DashBoardLayout>
        }/>
  </Routes>
  </BrowserRouter>
)
}