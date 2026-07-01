import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
export default function ReviewProfiles(){
    const[profiles,setprofiles]=useState([]);
    useEffect(()=>{
        const fetchReviewedProfiles=async()=>{
           try{
            console.log("Fetching profiles");
           const response=await axios.get("http://localhost:8000/api/Profile/review-profiles");
           setprofiles(response.data?.ReviewedProfiles || []);
          
           }catch(error)
           {
              console.log("Error fetching profiles:", error);
           }
        }
        fetchReviewedProfiles();
    },[]);

    return(
       <div>
        {profiles?.length> 0 && 
                      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6"  >
                       {profiles.map((profile)=>(
                         <div key={profile._id} className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-md gap-3 border-1 border-gray-100 cursor-pointer hover:border-violet-200 hover:shadow-lg  transition-all duration-200">
                          
                             <img src={profile?.photo?.url} alt="user" className="w-12 h-12 rounded-full ring-gray-500 blur-sm" />
                             <div className="text-center">
                                 <p className=" mt-2 text-sm font-bold text-gray-900">{profile.name}.</p>
                                 <p className="text-sm mt-2 text-gray-400">{profile.domains?.join(" | ")}</p>
                             </div>
                             <div className="w-full h-px bg-gray-300" />
                             <div className="flex flex-wrap gap-2 mb-2">
                             {profile.skills?.length > 0 && (
                                profile.skills.map((skill,index)=>(
                                 <div key={`${skill}-${index}`} className="bg-violet-50 text-violet-700 rounded-full
                                   px-2.5 py-0.5 text-sm font-medium">
                                   {skill}
                                 </div>
                                ))
                             )}
                             </div>
                         </div>   
                       ))}
                       </div>}
       </div>
    )
}