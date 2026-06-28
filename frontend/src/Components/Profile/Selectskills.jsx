import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
export default function Selectskills({onClose,selectedskills,setselectedskills}){
    const[skills,setskills]=useState([]);
    useEffect(()=>{
    const fetchallskills=async()=>{
      try{
        const response=await axios.get("http://localhost:8000/api/Profile/get-skills",{
          withCredentials:true,
        });
        setskills(response.data.skills || []);
       
      }catch(error)
      {
        if(error.response)
        {
          alert(error.response?.data?.msg || "Cannot fetch skills");
        }
        else
        {
          alert("Internal server error");
        }
      }
    }
    fetchallskills();
  },[]);
  const handleskillselect=async(skill)=>{
    let updatedskills;
    if(selectedskills.includes(skill))
    {
        updatedskills=selectedskills.filter((s)=>s!==skill);
    }
    else{
        updatedskills=[...selectedskills,skill];
    }
    setselectedskills(updatedskills);
  }
    return(
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 " onClick={()=>onClose()}/>
            <div className=" relative  p-4 z-50 bg-white flex rounded-xl max-w-lg">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                   <h1 className="text-black text-lg font-sans">Select your skills</h1>
                   <div className="flex flex-1 justify-end">
                    <button onClick={()=>onClose()} className="text-red-500 font-bold text-lg">x</button>
                   </div>
                </div>
                  {skills.length> 0 &&
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill)=>(
                      <div key={skill}
                      onClick={()=>handleskillselect(skill)}
                      className={`rounded-full bg-black px-4 py-2 text-sm font-medium
                      ${selectedskills.includes(skill) ?
                        "bg-green-200 text-green-700"
                        :"bg-purple-200 text-purple-700"
                      }`}>
                        {skill}
                      </div>
                    ))}
                    </div>}
              </div>
            </div>
        </div>
    )
}