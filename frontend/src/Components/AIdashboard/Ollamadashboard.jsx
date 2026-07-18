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
               {answer && (
  <div className="flex flex-col gap-6 p-4">

    {/* AI Summary */}
    <div className="bg-purple-50 rounded-xl p-4 border">
      <h2 className="font-bold text-purple-700 text-lg">
        🤖 Collab AI
      </h2>

      <p className="text-gray-600 mt-2">
        I found {answer.users.length} developers,
        {" "}{answer.teams.length} teams and
        {" "}{answer.Work.length} projects
        matching your request.
      </p>
    </div>

    {/* USERS */}
    <div>

      <h2 className="font-bold text-lg mb-3">
        👤 Developers
      </h2>

      <div className="space-y-3">

        {answer.users.map(user => (

          <div
            key={user.id}
            className="border rounded-xl p-4 shadow-sm"
          >

            <h3 className="font-semibold">
              {user.name}
            </h3>

            <p className="text-sm text-gray-500">
              {user.skills.join(", ")}
            </p>

            <button
              className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
            >
              View Profile
            </button>

          </div>

        ))}

      </div>

    </div>

    {/* TEAMS */}

    <div>

      <h2 className="font-bold text-lg mb-3">
        👥 Teams
      </h2>

      <div className="space-y-3">

        {answer.teams.map(team => (

          <div
            key={team.id}
            className="border rounded-xl p-4 shadow-sm"
          >

            <h3 className="font-semibold">
              {team.title}
            </h3>

            <p className="text-gray-500">
              {team?.description}
            </p>

            <button
              className="mt-3 bg-green-500 text-white px-3 py-1 rounded"
            >
              View Team
            </button>

          </div>

        ))}

      </div>

    </div>

    {/* PROJECTS */}

    <div>

      <h2 className="font-bold text-lg mb-3">
        📂 Projects
      </h2>

      <div className="space-y-3">

        {answer.Work.map(w=> (

          <div
            key={w.id}
            className="border rounded-xl p-4 shadow-sm"
          >

            <h3 className="font-semibold">
              {w.name}
            </h3>

            <p className="text-sm text-gray-500">
              Owner: {w.owner}
            </p>

            <button
              onClick={() =>
                navigate(`/get-project/${w.id}`)
              }
              className="mt-3 bg-purple-500 text-white px-3 py-1 rounded"
            >
              Open Project
            </button>

          </div>

        ))}

      </div>

    </div>

  </div>
)}
              </div>
              
           </div>
        </div>
    )
}