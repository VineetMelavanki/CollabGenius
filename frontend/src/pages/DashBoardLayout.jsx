import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {IoArrowBack} from "react-icons/io5"
import { BellIcon } from "@heroicons/react/24/outline";
export default function DashBoardLayout({ children }) {
  const [open, setopen] = useState(false);
  const navigate = useNavigate();
  const [hasprofile, sethasprofile] = useState(false);
  const[Notifications,setnotifications]=useState([]);
  const[error,seterror]=useState("");
  const[message,setmessage]=useState("");
  const[darkmode,setdarkmode]=useState(false);
  const[about,setabout]=useState(true);
  useEffect(() => {
    const profileverify = async () => {
      sethasprofile(false);
      try {
        const response = await axios.get("http://localhost:8000/api/Profile/Get-me", {
          withCredentials: true
        });
        sethasprofile(response.data.hasprofile);
      } catch (error) {
        console.log(error);
        sethasprofile(false);
      }
    };
    profileverify();
  }, []);

  useEffect(()=>{
    seterror("");
       setmessage("");

       const getallnotifications=async()=>{
           try{
               const response=await axios.get("http://localhost:8000/api/My/Notifications",
           {
               withCredentials: true
           }
       )
       setnotifications(response.data.Notify || []);
       setmessage(response.data.msg || "All Notifications fetched");
           }catch(error)
           {
               if(error.response)
               {
                 console.log(error);
                   seterror(error.response?.data?.msg || "Cannot fetch notifications");
               }else
               {
                   seterror("Internal server error");
               }
           }

       }
       getallnotifications();
 },[]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/User/logout", {}, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setopen(false)}
      />
      
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>
          <nav className="space-y-2">
            <button
              onClick={() => { navigate("/dashboard"); setopen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition text-gray-700 font-medium"
            >
              Home
            </button>
            {!hasprofile && (
              <button
                onClick={() => { navigate("/Create-Profile"); setopen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition text-gray-700 font-medium"
              >
                Create Profile
              </button>
            )}
            <button
              onClick={() => { navigate("/View-Profile"); setopen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition text-gray-700 font-medium"
            >
              View Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition text-gray-700 font-medium"
            >
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <button onClick={()=>{navigate(-1);setabout(!about)}}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-400 font-medium border-">
                <IoArrowBack size={20}/>
              </button>
              <button
                onClick={() => setopen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-gray-800">Collab Genius</h1>
            </div>
            
            <h2 className="text-lg font-bold text-primary-600 hidden md:block">Dashboard</h2>
            
            <div className="flex gap-3 ">
              <button onClick={()=>setdarkmode(!darkmode)} className="bg-black flex sm:text-sm my-2  md:text-md mx-3 lg:text-lg  text-white  font-bold border border-black p-2 rounded-2xl">Dark Mode</button>
              <button className="relative p-2 rounded-full hover:bg-gray-200 transition" onClick={()=>navigate("/Notifications")}>
                <BellIcon className="h-6 w-6 text-gray-700" />
                {Notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center font-bold">
                    {Notifications.length}
                  </span>
                )}
              </button>
              <button className="text-white border-2 bg-blue-500 font-bold px-4  rounded-lg hover:bg-blue-600 transition"
              onClick={()=>navigate("/allusers")}>
                All USERS
              </button>
              <button className="text-white bg-blue-500 border-2 border-gray-300 font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={()=>navigate("/your-projects")}>
                Your Team
              </button>
            
              <button
                onClick={handleLogout}
                className="text-white px-4 py-2 border-2 border-red-500 bg-red-500 font-bold rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
      {darkmode && <div className=" bg-black/75 min-h-screen w-full">
           <div className="pt-4 px-4">
          {children}
        </div>
        </div> }
      {!darkmode && <div className=" bg-white min-h-screen w-full">
        <div className="pt-4 px-4">
          {children}
        </div>
        </div> }  
      </div>
    </div>
  );
}
