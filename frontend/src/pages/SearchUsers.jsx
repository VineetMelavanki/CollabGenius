import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { FaSearch } from "react-icons/fa";
import { FaUser ,FaCode ,FaTrash } from "react-icons/fa";
import {MdDomain} from "react-icons/md"
import { ChevronUp ,ChevronDown} from "lucide-react";
import { MdAdd } from "react-icons/md";
import SelectDomain from "../Components/Profile/SelectDomain";
import Selectskills from "../Components/Profile/Selectskills";
export default function SearchUsers(){
  
  const navigate=useNavigate();
  const[profiles,setprofiles]=useState(()=>{
   const cached=sessionStorage.getItem("searchProfiles");
   if(!cached || cached=="undefined")
   {
      return [];
   }
   return JSON.parse(cached);
  });
  const[opendomains,setopendomains]=useState(false);
  const[openskills,setopenskills]=useState(false);
    const[selectedskills,setselectedskills]=useState(()=>{
      const cached=sessionStorage.getItem("searchskills");
      if(!cached || cached=="undefined")
   {
      return [];
   }
   return JSON.parse(cached);
    });
    const[selecteddomains,setselecteddomains]=useState(()=>{
      const cached=sessionStorage.getItem("searchdomains");
     if(!cached || cached=="undefined")
   {
      return [];
   }
   return JSON.parse(cached);
    });
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
       const data=response.data.Profiles;
       sessionStorage.setItem("searchProfiles",JSON.stringify(data));
      setprofiles(response.data.Profiles || []);

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
   if(selectedskills.length==0 && selecteddomains.length==0)
   {
      setprofiles([]);
      sessionStorage.removeItem("searchProfiles");
       sessionStorage.removeItem("searchProfiles");
      sessionStorage.removeItem("searchskills");
      sessionStorage.removeItem("searchdomains");
      return;
   }  
   sessionStorage.setItem("searchskills",JSON.stringify(selectedskills));
   sessionStorage.setItem("searchdomains",JSON.stringify(selecteddomains));
   fetchProfiles();
  },[selectedskills,selecteddomains]);
   
   return(
    <div className="flex bg-white min-h-screen">
         <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] w-96  border-r bg-white shadow-xl ">
             <div className="flex flex-col gap-3 p-3 mx-2">
                 <div className="flex flex-row gap-4 items-center justify-center border p-2 rounded-xl shadow-md hover:shadow-md">
                    <FaUser className="w-5 h-5 text"/>
                     <h1 className="text-purple-500 font-bold text-lg ">Collab-Genius Users</h1>
                 </div>
                 <div className="flex  p-3 mt-8 border items-center justify-start shadow-md rounded-xl">
                    <div className="flex flex-col gap-3 w-full">
                       <div className="flex flex-row gap-4 rounded-xl p-2">
                        <FaCode className="w-5 h-5 my-1"/>
                            <h1 className="text-black text-lg  font-sans">Domains</h1>
                            <div className="flex flex-1 gap-2 justify-end">
                              
                              <div className="flex flex-row  gap-4">
                                 <button><FaTrash onClick={()=>setselecteddomains([])} className="text-red-500"/></button>
                                 <MdAdd onClick={()=>setopendomains(true)} className="w-7 h-7 text-green-500 hover:bg-green-200 rounded-full "/>
                              </div>
                                 {opendomains && <SelectDomain
                                 onClose={()=>setopendomains(false)}
                                 selecteddomain={selecteddomains}
                                 setselecteddomain={setselecteddomains}/>}
                            </div>
                       </div>

                       {selecteddomains.length > 0 &&
                       <div className="flex flex-wrap gap-2">
                        {selecteddomains.map((domain,index)=>(
                           <div key={domain} className="">
                               <span key={`${domain}-${index}`} className="rounded-full font- bg-blue-200 px-3 py-1.5 text-sm text-blue-700 shadow-sm">
                            {domain}
                          </span>
                           </div>
                        ))}
                        </div>}
                    </div>
                 </div>
                 

                 <div className="flex  p-3 mt-8 border items-center justify-start shadow-md rounded-xl">
                    <div className="flex flex-col gap-3 w-full">
                       <div className="flex flex-row gap-4 rounded-xl p-2">
                        <FaCode className="w-5 h-5 my-1"/>
                            <h1 className="text-black text-lg  font-sans">Skills</h1>
                            <div className="flex flex-1 gap-2 justify-end">
                             <div className="flex flex-row  gap-4">
                                 <button><FaTrash onClick={()=>setselectedskills([])} className="text-red-500"/></button>
                                 <MdAdd onClick={()=>setopenskills(true)} className="w-7 h-7 text-green-500 hover:bg-green-200 rounded-full "/>
                              </div>
                                {openskills && <Selectskills
                                onClose={()=>setopenskills(false)}
                                selectedskills={selectedskills}
                                setselectedskills={setselectedskills}/>}
                            </div>
                       </div>

                       {selectedskills.length > 0 &&
                       <div className="flex flex-wrap gap-2">
                        {selectedskills.map((skill,index)=>(
                           <div key={skill} className="">
                               <span key={`${skill}-${index}`} className="rounded-full  bg-blue-200 px-3 py-1.5 text-sm text-blue-700 shadow-sm">
                            {skill}
                          </span>
                           </div>
                        ))}
                        </div>}
                    </div>
                 </div>
             </div>
         </aside>
         <main className="ml-96 flex-1 p-6">
             {profiles?.length> 0 &&
              <div className="grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6"  >
               {profiles.map((profile)=>(
                 <div key={profile._id} className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-md gap-3 border border-gray-100 cursor-pointer hover:border-violet-200 hover:shadow-md transition-all duration-200">
                     <img src={profile?.photo?.url} alt="user" className="w-12 h-12 rounded-full ring-gray-500 " />
                     <div className="text-center">
                         <p className=" mt-2 text-sm font-bold text-gray-900">{profile.name}.</p>
                         <p className="text-sm mt-2 text-gray-400">{profile.domains?.join(" | ")}</p>
                     </div>
                     <div className="w-full h-px bg-gray-300" />
                     <div className="flex flex-wrap gap-2 mb-2">
                     {profile.skills.length > 0 && (
                        profile.skills.map((skill,index)=>(
                         <div key={`${skill}-${index}`} className="bg-violet-50 text-violet-700 rounded-full
                           px-2.5 py-0.5 text-sm font-medium">
                           {skill}
                         </div>
                        ))
                     )}
                     </div>
                     <div className="text-md text-gray-400">
                       Level: <span className="text-gray-700 font-semibold">{profile.skillevel}</span>
                     </div>

                     <button
                    onClick={() =>navigate(`/view-profile/${profile.userId}`)}
                    className="w-full border border-gray-200 rounded-xl py-2 text-xs text-gray-600 font-medium font-inter hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all duration-200">
                         View profile
                     </button>
                 </div> 
                 
                 
               ))}
               </div>}     
         </main>
    </div>
   );
}