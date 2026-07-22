import { useState } from "react";
import React from "react";
import axios from "axios";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../AuthContext";
export default function NoresNodup({handlesubmitnew,handlechange,dashboardprompt}){
    const {user}=useAuth();
    return(
        <div className="flex flex-col w-full items-center justify-center gap-2 border p-4">
                 <h1 className="text-xl my-4">Back to it ,<span className="font-bold text-violet-500">{user?.name}</span></h1>

                <div className="w-full max-w-md">
                    <form onSubmit={handlesubmitnew} className="flex items-center gap-2 rounded-xl px-4 py-2  shadow-lg">
                      <input
                      type="text"
                      name="prompt"
                      value={dashboardprompt.prompt}
                      onChange={handlechange}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-transparent outline-none p-3 "
                      />
                      <button type="submit" className="bg-red-400 rounded-full p-1" >
                        <ArrowUpIcon className="w-5 h-5"/>
                      </button>
                   </form>
                 </div>
               
        </div>
    )
} 