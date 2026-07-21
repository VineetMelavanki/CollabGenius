import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import { FaRobot } from "react-icons/fa";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../AuthContext";
import NoresNodup from "./NoresNodup";
import Responseexists from "./Responseexists";
import axios from "axios";
export default function OllamaDashboard({onClose,prompt,answer,dupliprompt}){
      const navigate=useNavigate();
      const{user}=useAuth();
      const[dashboardprompt,setdashboardprompt]=useState({
        prompt:"",
      });
      const[reservedprompt,setreservedprompt]=useState("");
      const handlechange=(e)=>{
        setdashboardprompt(()=>({[e.target.name]:e.target.value}));
      }
      const[response,setresponse]=useState(null);
      const handlesubmit=async(e)=>{
        e.preventDefault()
        try{
         const response=await axios.post("http://localhost:8000/api/ai/get-answers",{
          prompt:dashboardprompt.prompt,
         },
        {
          withCredentials:true,
        });
        setresponse(response?.data?.finalresults ||response?.data?.response);
        setreservedprompt(dashboardprompt.prompt);
        setdashboardprompt({prompt:""});
        }catch(error)
        {
          if(error.response)
          {
            alert(error.response?.data?.msg || "Cannot fetch results");
          }
          else
          {
            alert("Internal server error");
          }
        }
      }
    return(
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={()=>onClose()}/>
           <div className="relative flex bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto">
           {!response && !dupliprompt && (
               <NoresNodup
                  handlesubmit={handlesubmit}
                  handlechange={handlechange}
                  dashboardprompt={dashboardprompt}/>
           )}
            

            {response && !dupliprompt && (
              <Responseexists
              handlesubmit={handlesubmit}
              handlechange={handlechange}
              dashboardprompt={dashboardprompt}
              reservedprompt={reservedprompt}
              response={response}/>
            )}     
            {dupliprompt && (
            <div className="flex flex-col h-full w-full">
               <div className="flex-1 overflow-y-auto p-6 space-y-4">

        
                <div className="flex justify-end">
                   <div className="max-w-md bg-violet-500 text-white px-4 py-3 rounded-2xl">
                    {dupliprompt}
                  </div>
                 </div>
        

        
                <div className="flex justify-start">
                  <div className="max-w-md bg-gray-100 text-black px-4 py-3 rounded-2xl">
                    {typeof answer === "string"
                    ? answer
                   : JSON.stringify(answer, null, 2)}
                  </div>
                </div>
        
          
              </div>
           </div>
            )}  
          </div>
        </div>
    )
}