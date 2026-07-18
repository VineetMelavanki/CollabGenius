import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"
import { FaUserFriends } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import CreateTeam from "../Components/Team/CreateTeam"
import { FolderIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OllamaDashboard from "../Components/AIdashboard/Ollamadashboard";
import {CpuChipIcon} from "@heroicons/react/24/outline";
export default function Homescreen(){
  const navigate=useNavigate();
   const {user, loading}=useAuth();
   const[users,setusers]=useState(0);
   const[Teams,setTeams]=useState([]);
   const[researchs,setresearchs]=useState({});
   const[openaisearch,setopenaisearch]=useState(false);
   const[prompt,setprompt]=useState("");
   const[dupliprompt,setdupliprompt]=useState(null);
   const[addteam,setaddteam]=useState(false);
   const[answer,setanswer]=useState(null);
   const handlechange=(e)=>{
    setprompt(e.target.value);
    setdupliprompt(e.target.value);
   }
   const handlesubmit=async(e)=>{
    e.preventDefault();
  
    try{
       const response=await axios.post("http://localhost:8000/api/ai/get-answers/",{
        prompt,
       },{
        withCredentials:true,
       });
      setanswer(response.data?.finalresults);

      console.log("The final results are : ",response.data?.finalresults);
      setprompt("");
    }catch(error)
    { 
       if(error.response)
       {
        alert(error.response?.data?.msg || "Cannot fetch answers");
       }
       else
       {
        console.log("The error is : ",error);
        alert("Internal server error");
       }
    }
   }
   useEffect(()=>{
    const fetchallTeams=async()=>{
      try{
       const response=await axios.get("http://localhost:8000/api/Team/getallTeams",{
        withCredentials:true,
       });
       setTeams(response.data?.length);

    }catch(error)
    {
      if(error.response)
      {
        alert(error.response?.data?.msg || "Cannot fetch profiles");
      }
      else
      {
        alert("Internal server error");
      }
    }
    }
    fetchallTeams();
   },[Teams]);
   useEffect(()=>{
    const fetchallusers=async()=>{
      try{
         const response=await axios.get("http://localhost:8000/api/User/allusers",{
        withCredentials:true,
      });
      setusers(response.data?.length);
     
      }catch(error)
      {
          if(error.response)
          {
            alert(error.response?.data?.msg || "Cannot fetch users");
          }
          else
          {
            alert("Internal server error");
          }
      }
    }
    fetchallusers();
   },[users]);

   useEffect(()=>{
    if (!user?._id) return;

    const fetchallresearch=async()=>{
      try{
        console.log("The user's id is : ",user?._id);
         const response=await axios.get(`http://localhost:8000/api/Work/get-work-by-member/${user._id}`,{
          withCredentials:true,
         });
         setTeams(response?.data?.allTeams);
         setresearchs(response.data?.allworks);
         console.log("All research data:",response.data?.allworks);
         console.log("All Teams : ",response?.data?.allTeams);
      }catch(error)
      {
        if(error.response)
        {
          alert(error.response?.data?.msg || "Cannot fetch researchs");
        }
        else
        {
          console.log("The error is : ",error);
          alert("Internal server errors");
        }
      }
    }
    fetchallresearch();
   },[user?._id]);

   if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading your profile...</div>;
   }

   if (!user) {
      return <div className="min-h-screen flex items-center justify-center">Please log in to continue.</div>;
   }

    return(
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-purple-50 to-indigo-50">
          {openaisearch && <OllamaDashboard
          onClose={()=>setopenaisearch(false)}
          prompt={prompt}
          answer={answer}
          dupliprompt={dupliprompt}/>
          }
          {addteam && <CreateTeam
          onClose={()=>setaddteam(false)}/>}
          
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header Section */}
            <div className="mb-12">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Welcome back, <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{user?.name}</span></h1>
                  <p className="text-gray-500 mt-2">Let's build something amazing today</p>
                </div>
                <button 
                  onClick={()=>setopenaisearch(true)} 
                  className="p-2 hover:bg-white rounded-lg transition"
                  title="AI Assistant"
                >
                  <CpuChipIcon className="w-6 h-6 text-purple-600 hover:text-purple-700"/>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">TEAMS</p>
                    <h3 className="text-3xl font-bold text-gray-900">{Teams.length || Teams}</h3>
                  </div>
                  <FolderIcon className="w-12 h-12 text-purple-600 bg-purple-100 rounded-lg p-2"/>
                </div>
                <button 
                  onClick={()=>setaddteam(true)} 
                  className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  Create Team
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">COLLABORATORS</p>
                    <h3 className="text-3xl font-bold text-gray-900">{users}</h3>
                  </div>
                  <FaUserFriends className="w-12 h-12 text-purple-600 bg-purple-100 rounded-lg p-2"/>
                </div>
              </div>
            </div>

            {/* AI Search Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What do you want to build today?</h2>
              <form onSubmit={handlesubmit} className="flex gap-3">
                <input 
                  type="text"
                  value={prompt}
                  onChange={handlechange}
                  placeholder="Describe your ideas, team, or what you need..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button 
                  type="submit" 
                  onClick={()=>setopenaisearch(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-medium whitespace-nowrap"
                >
                  ✨ Ask AI
                </button>
              </form>
            </div>

            {/* Content Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Continue Working */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Continue Working</h3>
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium text-sm">View All →</a>
                </div>
                
                <div className="space-y-3">
                  {Teams.length > 0 ? (
                    Teams.map((Team) => (
                      researchs[Team]?.map((research) => (
                        <div 
                          key={research._id} 
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition border border-gray-100"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">{research?.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">In {Team}</p>
                          </div>
                          <button 
                            onClick={() => navigate(`/Research/${Team}/${research._id}`)}
                            className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition font-medium text-sm"
                          >
                            View
                          </button>
                        </div>
                      ))
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No active work items yet</p>
                  )}
                </div>
              </div>

              {/* Sidebar Cards */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaClock className="w-5 h-5 text-purple-600"/>
                    <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                  </div>
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>

                {/* AI Research Feed */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">AI Research Feed</h3>
                  <div className="flex items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500">Feed coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}