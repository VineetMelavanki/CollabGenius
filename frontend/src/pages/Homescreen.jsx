import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"
import { FaUserFriends } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FolderIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import OllamaDashboard from "../Components/AIdashboard/Ollamadashboard";
import {CpuChipIcon} from "@heroicons/react/24/outline";
export default function Homescreen(){
   const {user, loading}=useAuth();
   const[users,setusers]=useState(0);
   const[projects,setprojects]=useState([]);
   const[researchs,setresearchs]=useState({});
   const[openaisearch,setopenaisearch]=useState(false);
   const[Teams,setTeams]=useState(0);
   const[prompt,setprompt]=useState("");
   const[answer,setanswer]=useState([]);
   const handlechange=(e)=>{
    setprompt(e.target.value);
   }
   const handlesubmit=async(e)=>{
    e.preventDefault();
  
    try{
       const response=await axios.post("http://localhost:8000/api/ai/get-answers/",{
        prompt,
       },{
        withCredentials:true,
       });
      setanswer(response.data?.Profiles);
      console.log("The answer are : ",response.data?.Profiles);

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
    const fetchallprojects=async()=>{
      try{
       const response=await axios.get("http://localhost:8000/api/Project/getallprojects",{
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
    fetchallprojects();
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
         setprojects(response?.data?.allprojects);
         setresearchs(response.data?.allworks);
         console.log("All research data:",response.data?.allworks);
         console.log("All projects : ",response?.data?.allprojects);
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
        <div className="min-h-screen w-full">
          {openaisearch && <OllamaDashboard
          onClose={()=>setopenaisearch(false)}
          prompt={prompt}
          answer={answer}/>
          }
          <div className="flex flex-col gap-2 w-full border p-2">
             <div className="flex sm:flex-col lg:flex-row gap-2 border  p-2">
               <div className="flex flex-col border sm:w-full lg:w-1/2">
                 <div className="flex flex-row gap-2 ">
                   <h1 className="text-3xl font-bold">WELCOME BACK, <span className="text-purple-500">{user?.name}</span> !</h1>
                   <div className="flex flex-1 justify-end p-2">
                     <CpuChipIcon onClick={()=>setopenaisearch(true)} className="w-8 h-8 hover:text-red-500"/>
                   </div>
                  </div>
                   <h1 className="text-gray-500 text-md">Let's build something amazing today</h1>
                 
                 <div className="flex flex-col p-4 rounded-2xl mt-8 mx-4 border bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50">
                   <h1 className="text-black font-bold mb-2">What do you want to build today?</h1>
                   <form onSubmit={handlesubmit} className="max-w-lg">
                    <div className="flex items-center gap-3">
                      <input type="text"
                      value={prompt}
                      onChange={handlechange}
                      placeholder="Describe your ideas , project or what you need"
                        className="flex-1 w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"/>

                          <button type="submit" onClick={()=>setopenaisearch(true)}
                            className="h-12 px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                          >
                           ✨ Ask AI
                          </button>
                    </div>
                   </form>
                 </div>
               </div>
                <div className="flex flex-1 mx-2 border">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex flex-row p-2 gap-2">
                        <h1 className="text-black font-grotesk mx-2">Collab AI assistance</h1>
                        <div className="flex flex-1 justify-end">
                            <h1 className="text-purple-500 mx-2 font-bold">View All</h1>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              <div className="min-w-full border grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-4 ">
                <div className="bg-white border w-auto p-2 rounded-xl shadow-md  ">
                  <div className="flex flex-row gap-2">
                    <FolderIcon className="text-purple-500 bg-purple-200 w-10 h-10 rounded-xl"/>
                    <div className="flex flex-col">
                      <h1 className="text-gray-400">Teams</h1>
                        <h1 className="text-xl font-bold">{Teams}</h1>
                    </div>
                  </div>
                </div>
                <div className="bg-white border w-auto p-2 rounded-xl shadow-md">
                  <div className="flex flex-row gap-2">
                     <FaUserFriends className="text-green-500 w-10 h-10"/>
                     <div className="flex flex-col">
                        <h1 className="text-gray-400">Collaborators</h1>
                        <h1 className="text-xl font-bold">{users}</h1>
                     </div>
                  </div>
                </div>
              </div>
              <div className="min-w-full border grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-3">
                 <div className="bg-white border w-auto p-4 rounded-xl shadow-md ">
                   <div className="flex flex-col gap-3 ">
                     <div className="flex flex-row gap-2">
                       <h1 className="sm:text-sm lg:text-lg text-black font-bold">Continue Working</h1>
                        
                     </div>
                     <div className="flex flex-col  gap-2">
                          {projects.length > 0 && (
                            projects.map((project)=>(
                             researchs[project]?.map((research)=>(
                              <div key={research._id} className="bg-white shadow-md rounded-xl  flex flex-row gap-2 p-2">
                                   <h1 className="text-blue-500 text-md font-bold">{research?.name}</h1>
                                   <div className="flex flex-1 justify-end ">
                                      <h1 className="text-black text-md mx-2">View</h1>
                                   </div>
                              </div>
                             ))
                            ))
                          )}
                        </div>
                   </div>
                 </div>
                 <div className="bg-white border w-auto p-4 rounded-xl shadow-md ">
                    <div className="flex flex-col gap-3">
                       <div className="flex flex-row gap-2">
                        <FaClock className="w-5 h-5 my-1 text-blue-500"/>
                          <h1 className="sm:text-sm lg:text-lg text-black font-bold">Recent Activity</h1>
                       </div>
                    </div>
                  </div>
                  <div className="bg-white border w-auto p-4 rounded-xl shadow-md ">
                    <div className="flex flex-col gap-3">
                       <div className="flex flex-row gap-2">
                      
                          <h1 className="sm:text-sm lg:text-lg text-black font-bold">AI Research feed</h1>
                       </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
    )
}