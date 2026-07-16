import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Homepage from './pages/Homepage';
import Login from './pages/LoginPage';
import Register from "./pages/Register";
import ViewProfile from './pages/ViewProfile';
import SideBar from "./pages/Dashboard"
import Research from './pages/Research';
import Homescreen from './pages/Homescreen';
import CreateProfile from './pages/CreateProfile';
import About from './pages/About';
import Navbar from './pages/navbar';
import DashBoardLayout from './pages/DashBoardLayout';
import AllTeams from './pages/allTeams';
import Teamdetails from './pages/Teamdetails';
import GetyourTeams from './pages/getyourTeams';
import Allusers from './pages/Getallusers';
import ViewIndiProfile from './pages/ViewIndiProfile';
import SearchUsers from './pages/SearchUsers';
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
        <SideBar>
      <ViewProfile/>
      </SideBar>
      </DashBoardLayout>
      }/>
      <Route path='/About' element={
         <Navbar>
          <About/>
          </Navbar>
      }/>
      <Route path='/HomeScreen' element={
        <DashBoardLayout>
          <SideBar>
            <Homescreen/>
            </SideBar>
          </DashBoardLayout>
      }/>
    <Route path='/Create-Profile' element={
      <DashBoardLayout>
        
      <CreateProfile/>
      </DashBoardLayout>
      }/>
      
        <Route path='/getallTeams' element={
          <DashBoardLayout>
            <SideBar>
            <AllTeams/>
            </SideBar>
          </DashBoardLayout>
        }/>
        <Route path='/get-Team/:TeamId' element={
          <DashBoardLayout>
            <SideBar>
            <Teamdetails/>
            </SideBar>
          </DashBoardLayout>
        }/>
        <Route path='/your-Teams' element={
          <DashBoardLayout>
            <SideBar>
            <GetyourTeams/>
            </SideBar>
          </DashBoardLayout>
        }/>
        <Route path='/view-profile/:id' element={
          <DashBoardLayout>
            <SideBar>
            <ViewIndiProfile/>
           </SideBar>
            </DashBoardLayout>
        }
        />
        <Route path='/allusers' element={
          <DashBoardLayout>
            <Allusers/>
            </DashBoardLayout>
        }/>
        <Route path='/Research/:TeamId/:workId' element={
          <DashBoardLayout>
              <SideBar>
              <Research/>
              </SideBar>
          </DashBoardLayout>
           
        }/>
       <Route path='/auth/github/callback' element={<Login/>}/>
       <Route path='/Search-Users' element={
        <DashBoardLayout>
          <SearchUsers/>
        </DashBoardLayout>
       }/>
  </Routes>
  </BrowserRouter>
)
}