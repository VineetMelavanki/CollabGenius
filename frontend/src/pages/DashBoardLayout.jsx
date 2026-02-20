import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {IoArrowBack} from "react-icons/io5"
export default function DashBoardLayout({ children }) {
  const [open, setopen] = useState(false);
  const navigate = useNavigate();
  const [hasprofile, sethasprofile] = useState(false);
  const[about,setabout]=useState(true);
  useEffect(() => {
    const profileverify = async () => {
      sethasprofile(false);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8000/api/Profile/Get-me", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        sethasprofile(response.data.hasprofile);
      } catch (error) {
        console.log(error);
        sethasprofile(false);
      }
    };
    profileverify();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
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
              <h1 className="text-xl font-bold text-gray-800">Collab Genius</h1>
            </div>
            
            <h2 className="text-2xl font-bold text-primary-600 hidden md:block">Dashboard</h2>
            
            <div className="flex gap-3">
              <button className="text-blue-500  border-2 border-gray-300 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
              onClick={()=>navigate("/your-projects")}>
                Your Projects
              </button>
            
              <button
                onClick={handleLogout}
                className="px-4 py-2 border-2 border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="min-h-screen w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
