import React from "react";
import {useNavigate} from "react-router-dom"
import { FaRobot } from "react-icons/fa";

export default function OllamaDashboard({onClose,prompt,answer,dupliprompt}){
      const navigate=useNavigate();
    return(
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-black/40" onClick={()=>onClose()}/>
           <div className="relative bg-white w-full max-w-lg h-full flex flex-col shadow-2xl overflow-y-auto">
              <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-3 p-4 w-full ">
                    <FaRobot className="w-6 h-6 text-red-500 my-1"/>
                     <h1 className="text-purple-500 font-bold text-lg my-1">Ask me anything</h1>
                  </div>
              {dupliprompt && <div className=" flex items-end p-3 rounded-xl justify-end text-end w-full ">
               <h1 className="text-black bg-gray-200 p-4">{dupliprompt}</h1>
                  </div> }
               {answer==null &&  <div className="flex items-center gap-3">
  <span className="text-2xl animate-pulse">✨</span>

  <span
    className="
      text-lg
      font-semibold
      bg-gradient-to-r
      from-slate-400
      via-white
      to-slate-400
      bg-[length:200%_100%]
      bg-clip-text
      text-transparent
      animate-[shine_2s_linear_infinite]
    "
  >
    Generating recommendations...
  </span>
</div>}  
               {answer && 
               <h1>Teams</h1>}
                {answer!==null && <div className="flex flex-col gap-4">
                
                    {answer?.projects?.length > 0 && (
                      <div className="grid grid-cols-3 p-2 gap-2 border-2">
                        {answer.projects.map((project)=>(
                          <div key={project.id} className="flex flex-col shadow-2xl hover:shadow-xl border p-2 gap-2">
                             <h1 className="text-blue-400 font-bold">{project?.title}</h1>
                             <button className="text-white bg-green-500 font-bold" onClick={()=>navigate(`/get-project/${project.id}`)}>View</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>}
              </div>
              
           </div>
        </div>
    )
}