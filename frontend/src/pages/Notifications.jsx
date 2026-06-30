import React, { useState } from "react";
import {FiCheckSquare} from "react-icons/fi";
import { XSquare } from "lucide-react";
import TeamJoiningreq from "../Components/Notifications/Teamjoiningreq";
import Teaminvitation from "../Components/Notifications/Teaminvitation";
import Teamassignment from "../Components/Notifications/Assignment";
import FriendRequest from "../Components/Notifications/FriendRequest";
export default function Notificationsection({onClose}){
  const[activetab,setactivetab]=useState("all");
  const tabClass = (tab) =>
  `pb-2 border-b-2 transition-colors duration-200 ${
    activetab === tab
      ? "border-b-blue-500 text-blue-500"
      : "border-b-transparent hover:border-b-blue-500"
  }`;
      return(
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={()=>onClose()}/>
            <div className="relative bg-white w-full max-w-lg h-full flex flex-col shadow-2xl overflow-y-auto">
                
                    <div className="flex flex-row gap-2 p-4 w-full">
                       <h1 className="text-slate-600 font-sans text-lg">Notifications</h1>
                       <div className="flex flex-1 justify-end mx-2">
                        <button>
                            <h1 className="text-lg text-red-500 font-bold" onClick={()=>onClose()}>X</h1>
                        </button>
                       </div>
                    </div>
                    <div className="flex flex-row gap-10 mx-4">
                     <button onClick={()=>{setactivetab("all")}} className={tabClass("all")} >All</button>
                     <button onClick={()=>{setactivetab("User-requests")}} className={tabClass("User-requests")}>User-requests</button>
                     <button onClick={()=>{setactivetab("Team-invites")}} className={tabClass("Team-invites")}  >Team-invites</button>
                     <button onClick={()=>{setactivetab("friend-requests")}} className={tabClass("friend-requests")} >friend-requests</button>
                    </div>
                    <div className="w-full h-px bg-gray-300 " /> 
                
          {(activetab==="User-requests" || activetab=="all") &&  (<TeamJoiningreq/> ) }    
           {(activetab==="Team-invites" || activetab=="all") && (<Teaminvitation/>) }  
           {(activetab==="friend-requests" || activetab=="all") && (<FriendRequest/>)}    
            </div>
      </div>
      )
}