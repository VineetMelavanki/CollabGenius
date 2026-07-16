import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function GetyourTeams()
{
   const navigate=useNavigate();
   const[error,seterror]=useState("");
   const[message,setmessage]=useState("");
   const[Teams,setTeams]=useState([]);
   useEffect(()=>{
    seterror("");
    setmessage("");
    const displayyourTeams=async()=>{
        try{
           const response=await axios.get("http://localhost:8000/api/Team/your-Teams",
            {
                withCredentials: true
            }
           )
           console.log(message);
           setTeams(response.data.myTeam);
           setmessage(response.data.msg || "Teams fetched successfully");
        }catch(error)
        {
            console.log(error.response)
           if(error.response)
           {
            seterror(error.response?.data?.msg || "Profile cannot be fetched");
           }
           else
           {
            seterror("Internal server error");
           }
        }
    }
    displayyourTeams();
   },[]);

   return(
      <div className="flex min-h-screen w-full">
        <div className="flex flex-col gap-2 w-full">
         <div className="flex justify-start p-8 items-center">
          <h1 className="text-black font-bold text-2xl p-1">
           My Teams
          </h1>

         </div>
         <div className="flex flex-col gap-3 ">
           {error && <h1 className="text-red-400 font-sans text-lg">{error}</h1>}
           
           {Teams.length===0 ?(
            <p className="text-gray-200 text-lg">Team not found</p>
           ):(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
             {Teams.map((Team)=>(
                  <div key={Team._id} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition ">
                   <h2 className="text-xl font-semibold text-gray-800">
                    {Team.title}
                   </h2>
                   <button className="mt-4 text-purple-600 font-medium hover:underline" onClick={()=>navigate(`/get-Team/${Team._id}`)}>
                    View Team →
                   </button>
                  </div>
             ))}
            </div>
           )}
         </div>
        </div>
      </div>
   )
}