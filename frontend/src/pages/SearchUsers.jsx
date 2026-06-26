import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { FaUser ,FaCode } from "react-icons/fa";
import {MdDomain} from "react-icons/md"
import { ChevronUp ,ChevronDown} from "lucide-react";

export default function SearchUsers(){
  const skills=[
       "backend",
       "frontend",
       "AI/ML",
       "node.js",
       "React",
       "Django",
  ];
  const[profiles,setprofiles]=useState([]);
    const[selectedskills,setselectedskills]=useState([]);
    const fetchProfiles=async()=>{
      try{
       const response=await axios.post("http://localhost:8000/api/Profile/get-profiles-by-skills",
         {
            skills:selectedskills,
         },{
            withCredentials:true,
         }
       );
       console.log(response.data.Profiles);
      setprofiles(response.data.Profiles || []);
      alert("Profile fetched successfully");
      }catch(error)
      {
        if(error.response)
        {
         alert(error.response?.data?.msg || "Cannot fetch profiles");
        }
        else
        {
         alert("Intenal server error");
        }
      }
   }
  useEffect(()=>{
   if(selectedskills.length==0)
   {
      setprofiles([]);
      return;
   }
   fetchProfiles();
  },[selectedskills]);

  const handleskillselect=async(skill)=>{
      let updatedskills;
      if(selectedskills.includes(skill))
      {
         updatedskills=selectedskills.filter((s)=>s!==skill);
      }
      else
      {
         updatedskills=[...selectedskills,skill];
      }
      setselectedskills(updatedskills);
   }
   
   return(
    <div className="flex bg-white min-h-screen">
         <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] w-96  border-r bg-white shadow-xl ">
             <div className="flex flex-col gap-3 p-3 mx-2">
                 <div className="flex flex-row gap-4 items-center justify-center border p-2 rounded-xl shadow-md hover:shadow-md">
                    <FaUser className="w-5 h-5 text"/>
                     <h1 className="text-purple-500 font-bold text-lg ">Collab-Genius Users</h1>
                 </div>
                 <div className="flex  p-3 mt-8 border items-center justify-center shadow-md rounded-xl">
                    <div className="flex flex-col gap-3">
                       <div className="flex flex-row gap-4 rounded-xl border p-3">
                        <FaCode className="w-5 h-5 my-1"/>
                            <h1 className="text-black text-lg  font-sans">Domains</h1>
                       </div>
                       <div className="flex flex-wrap gap-2">
                         {skills.map((skill)=>(
                           <div key={skill}
                           onClick={()=>handleskillselect(skill)}
                            className={`rounded-full bg-blue-100 px-4 py-2 text-sm font-medium
                            ${selectedskills.includes(skill) ? 
                              "bg-green-200 text-green-700" 
                               : "bg-purple-200 text-purple-700"}`}>
                              <h1>{skill}</h1>
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>
                 
             </div>
         </aside>
         <main className="ml-96  w-full">
           {profiles?.length> 0 &&
           <div className="grid grid-cols-5">
            {profiles.map((profile)=>(
               <div key={profile._id} className="">
                  <div className="flex flex-row gap-3">
                     <h1 className="text-black font-sans">{profile.name}</h1>
                  </div>
               </div>
            ))}
            </div>}
         </main>
    </div>
   );
}