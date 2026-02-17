import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Dashboard() {
  const navigate=useNavigate();
  const[hasprofile,sethasprofile]=useState(false);
  const[error,seterror]=useState("");
  useEffect(()=>{
    const profileverify=async()=>{
      sethasprofile(null);
      const token=localStorage.getItem("token");
      if(!token)
      {
        seterror("Invalid login");
        navigate("/login");
      }
      try{
        const response=await axios.get("http://localhost:8000/api/Profile/Get-me",{
          headers:{
            Authorization:`Bearer ${token}`,
          }
        });
        sethasprofile(response.data.hasprofile);
      }catch(error)
      {
        console.log(error);
         sethasprofile(false);
      }
    }
    profileverify();
  },[])
  return (
     <div className="min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to the Dashboard</h1>
        <p className="text-xl text-primary-600">Access all the features below</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* About Section Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">About Section</h3>
            <p className="text-gray-600 mb-4">Learn more about our platform</p>
            <button
              onClick={() => navigate("/About")}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium"
            >
              View About
            </button>
          </div>
        </div>

        {/* Create Profile Card */}
        {!hasprofile && (
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Profile</h3>
              <p className="text-gray-600 mb-4">Set up your profile to get started</p>
              <button
                onClick={() => navigate("/Create-Profile")}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
              >
                Create Profile
              </button>
            </div>
          </div>
        )}

        {/* Create Project Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Project</h3>
            <p className="text-gray-600 mb-4">Start a new collaborative project</p>
            <button
              onClick={() => navigate("/Create-Project")}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
      
  );
}
