import { useState } from "react";
import React from "react";
import axios from "axios";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../AuthContext";

const LoadingAnimation = () => (
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

export default function NoresNodup({handlesubmitnew,handlechange,dashboardprompt,isLoading}){
    const {user}=useAuth();
    return(
        <div className="flex items-center justify-center my-64">
          <div className="flex flex-col w-full items-center mt-8 justify-center gap-4 border p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl">
                   <h1 className="text-2xl my-4 text-gray-800">Back to it, <span className="font-bold text-violet-600">{user?.name}</span></h1>
                  <div className="w-full max-w-md">
                      <form onSubmit={handlesubmitnew} className="flex items-center gap-3 rounded-2xl px-5 py-3 shadow-lg bg-white border border-gray-200">
                        <input
                        type="text"
                        name="prompt"
                        value={dashboardprompt.prompt}
                        onChange={handlechange}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-transparent outline-none p-2 text-gray-700 placeholder-gray-400"
                        disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading} className={`bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full p-2 hover:shadow-lg transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`} >
                          {isLoading ? <LoadingAnimation /> : <ArrowUpIcon className="w-5 h-5 text-white"/>}
                        </button>
                     </form>
                   </div>
          
          </div>
        </div>
    )
} 