import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {FolderIcon} from "@heroicons/react/24/solid"
import { Outlet } from "react-router-dom";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
export default function SideBar({children}) {
  const navigate=useNavigate();
  const[activetab,setactivetab]=useState("home");
  const tabclass=(tab)=>
    `w-full text-left px-4 py-3 rounded-lg ${
      activetab===tab 
      ?"bg-blue-100 text-blue-500"
      :"bg-transparent"
    }`
  const[hasprofile,sethasprofile]=useState(false);
  const[error,seterror]=useState("");
  useEffect(()=>{
    const profileverify=async()=>{
      sethasprofile(null);
      try{
        const response=await axios.get("http://localhost:8000/api/Profile/Get-me",{
          withCredentials: true
        });
        sethasprofile(response.data.hasprofile);
      } catch (error) {
        console.log("The error is : ", error);
        if (error.response?.status === 404) {
          sethasprofile(false);
          return;
        }
        seterror("Invalid login");
        navigate("/login");
      }
    }
    profileverify();
  },[])
  return (
     <div className="min-h-screen">
       <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] flex bg-white z-40 w-60 shadow-xl ">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
          <nav className="space-y-2">
            <button
              onClick={() => { navigate("/HomeScreen");setactivetab("home")}}
              className={tabclass("home")}
            >
              Home
            </button>
            {!hasprofile && (
              <button
                onClick={() => { navigate("/Create-Profile");}}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition text-gray-700 font-medium"
              >
                Create Profile
              </button>
            )}
            <button
              onClick={() => {navigate("/View-Profile");setactivetab("view-profile")}}
              className={tabclass("view-profile")}
            >
              View Profile
            </button>

            <button
            onClick={()=>{navigate("/getallTeams");setactivetab("all-projects")}}
            className={tabclass("all-projects")}>
              Teams
            </button>
            <button
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition text-gray-700 font-medium"
            >
              Logout
            </button>

          </nav>
        </div>
       </aside>
       <div className="ml-60 flex-1 p-6">
          {children}
     
       </div>
      </div>
      
  );
}
