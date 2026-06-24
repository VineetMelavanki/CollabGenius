import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {FolderIcon} from "@heroicons/react/24/solid"
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
export default function Dashboard() {
  const navigate=useNavigate();
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
      }catch(error)
      {
        console.log("The error is : ",error);
        seterror("Invalid login");
        navigate("/login");
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
          <div className="text-center ">
            <div className=" rounded-full flex flex-col items-center justify-center mx-auto mb-4 gap-4">
              <FolderIcon className="w-10 h-10 text-yellow-500 mb-5"/>
               <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Create Your Team
               </h3>
               <h3 className="text-lg font-thin text-gray-400 mb-2">
                Build a team worth collaborating
               </h3>
               <button onClick={()=>navigate("/Create-Project")} className="text-xl font-bold bg-green-400 hover:bg-green-500 text-white p-4 rounded-2xl">
                 Create Team
               </button>
            </div>
          

          </div>
        </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
            <div className="text-center ">
                <div className=" rounded-full flex flex-col items-center justify-center mx-auto mb-4 gap-4">
                   <FolderIcon className="w-10 h-10 text-yellow-500 mb-5"/>
                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
                   View All Team
                 </h3>
                 <h3 className="text-lg font-thin text-gray-400 mb-2">
                    You can easily choose the project you want to join
                 </h3>
                 <button onClick={()=>navigate("/getallprojects")} className="text-xl font-bold bg-green-400 hover:bg-green-500 text-white px-11 py-5   rounded-2xl">
                     View
                 </button>
                </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
          <div className="text-center ">
            <div className=" rounded-full flex flex-col items-center justify-center mx-auto mb-4 gap-4">
              <MagnifyingGlassIcon className="w-12 h-12 text-blue-500"/>
               <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Search Team-mates
               </h3>
               <h3 className="text-lg font-thin text-gray-400 mb-2">
                Find a team-mate of your required domain
               </h3>
               <button className="text-xl font-bold bg-green-400 hover:bg-green-500 text-white p-5 rounded-2xl my-2">
                 Search
               </button>
            </div>
          

          </div>
        </div>
          </div>
          
      </div>
      
  );
}
