import React from "react";

import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
export default function OllamaDashboard({onClose,prompt,answer}){
      const navigate=useNavigate();
    return(
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-black/40" onClick={()=>onClose()}/>
           <div className="relative bg-white w-full max-w-lg h-full flex flex-col shadow-2xl overflow-y-auto">
              <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2 p-4 w-full">
                    <FaRobot className="w-5 h-5 text-red-500"/>
                     <h1 className="text-purple-500 font-sans text-lg">Ask me anything</h1>
                  </div>
                  <div className=" flex items-end p-3 rounded-xl justify-end text-end w-full ">
                   <h1 className="text-black bg-gray-200 p-4">{prompt}</h1>
                  </div>
                {answer &&<div className="flex flex-col gap-3">
                    <h1 className="text text-lg text-gray-500">The recommended profiles are</h1>
                    <div className=" grid grid-cols-2 gap-2">
                       {answer.map((ans)=>(
                        <div key={ans} className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-md gap-3 border-1 border-gray-100 cursor-pointer hover:border-violet-200 hover:shadow-md transition-all duration-200">
                        <img src={ans?.photo?.url} alt="user" className="w-12 h-12 rounded-full ring-gray-500 " />
                     <div className="text-center">
                         <p className=" mt-2 text-sm font-bold text-gray-900">{ans.name}.</p>
                         <p className="text-sm mt-2 text-gray-400">{ans.domains?.join(" | ")}</p>
                     </div>
                     <div className="w-full h-px bg-gray-300" />
                     <div className="flex flex-wrap gap-2 mb-2">
                     {ans.skills.length > 0 && (
                        ans.skills.map((skill,index)=>(
                         <div key={`${skill}-${index}`} className="bg-violet-50 text-violet-700 rounded-full
                           px-2.5 py-0.5 text-sm font-medium">
                           {skill}
                         </div>
                        ))
                     )}
                     </div>
                     <div className="text-md text-gray-400">
                       Level: <span className="text-gray-700 font-semibold">{ans.skillevel}</span>
                     </div>

                     <button
                    onClick={() =>navigate(`/view-profile/${ans.userId}`)}
                    className="w-full border border-gray-200 rounded-xl py-2 text-xs text-gray-600 font-medium font-inter hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all duration-200">
                         View profile
                     </button>
                        </div>
                       ))}
                    </div>
                  </div>}
              </div>
              
           </div>
        </div>
    )
}