import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { FaUser ,FaCode } from "react-icons/fa";
import {MdDomain} from "react-icons/md"
import { ChevronUp ,ChevronDown} from "lucide-react";
import { MdAdd } from "react-icons/md";
import SelectDomain from "../Components/Profile/SelectDomain";
import Selectskills from "../Components/Profile/Selectskills";
export default function SearchUsers(){
  

  const[profiles,setprofiles]=useState([]);
  const[opendomains,setopendomains]=useState(false);
  const[openskills,setopenskills]=useState(false);
    const[selectedskills,setselectedskills]=useState([]);
    const[selecteddomains,setselecteddomains]=useState([]);
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
   if(selectedskills.length==0 || selecteddomains.length==0)
   {
      setprofiles([]);
      return;
   }
   
   fetchProfiles();
  },[selectedskills]);


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
                              <MdAdd onClick={()=>setopendomains(true)} className="w-7 h-7 text-red-500 hover:bg-red-200 rounded-full "/>
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
                              <MdAdd onClick={()=>setopenskills(true)} className="w-7 h-7 text-red-500 hover:bg-red-200 rounded-full "/>
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
         <main className="ml-96  w-full border">
           <div className="bg-gray-100  h-full">
              {profiles?.length> 0 &&
              <div className="grid grid-cols-5 p-2 border max-w-md">
               {profiles.map((profile)=>(
                  <div key={profile._id} className="">
                     <div className="flex flex-row gap-3">
                        <h1 className="text-black font-sans">{profile.name}</h1>
                     </div>
                  </div>
               ))}
               </div>}
           </div>
         </main>
    </div>
   );
}