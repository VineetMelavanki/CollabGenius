import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaGithub ,FaCode} from "react-icons/fa";
export default function ViewIndiProfile()
{
   const[user,setuser]=useState(null);
   const[error,seterror]=useState("");
   const[error1,seterror1]=useState("");
   const[message,setmessage]=useState("");
   const[teams,setteams]=useState([]);
   const {id}=useParams();

   useEffect(()=>{
     seterror("");
     setmessage("");
     const viewprofile=async()=>{
        try{
            const response=await axios.get(`http://localhost:8000/api/Profile/View-profile/${id}`,
                {
                    withCredentials: true
                }

            );
            console.log(message);
            setuser(response.data.Profile);
            setmessage(response.data.msg || "Profile fetched successfully");


        }catch(error)
        {
            if(error.response)
            {
                seterror(error.response.data.msg || "Profile cannot be fetched");
            }
            else
            {
                seterror("Internal server error");
            }
        }
     }
     viewprofile();
   },[id]);
   

   return(
     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(233,213,255,0.25),_rgba(255,255,255,0.95)_45%,_rgba(224,242,254,0.35))] px-4 py-8 sm:px-6 lg:px-8">
        {user && (
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1.55fr]" >
                <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.28)] backdrop-blur sm:p-8">
                     <div className="flex flex-col items-center text-center">
                        <div className="relative mb-5">
                         <img
                           src={user?.photo?.url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User")}
                           alt={user?.name}
                           className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg sm:h-32 sm:w-32"
                         />
                           <div className="absolute bottom-1 right-1 rounded-full border border-white bg-emerald-500 p-1.5 shadow-sm" />
                        </div>

                        <div className="space-y-2 ">
                          <h2 className="text-2xl p-2 font-semibold text-slate-800">{user?.name}</h2>
                          <p className="text-sm leading-6 text-slate-600">
                          {user?.Bio || "A thoughtful collaborator building polished digital experiences."}
                          </p>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {user.skills.length > 0 ? (
                          user.skills.map((skill, index) => (
                           <span
                              key={`${skill}-${index}`}
                               className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700"
                              >
                              {skill}
                           </span>
                          ))
                        ) : (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-500">
                         Skills coming soon
                        </span>
                        )}
                        </div>
                     </div>
               </div>

               <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.28)] backdrop-blur sm:p-7">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                     <p className="text-xs font-smibold uppercase tracking-[0.26em] text-slate-500">Profile overview</p>
                     <h3 className="text-xl font-semibold text-slate-800">Professional details</h3>
                    </div>
                                  
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,_rgba(248,250,252,0.95),_rgba(255,255,255,0.9))] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">About</p>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{user?.Bio || "No bio added yet."}</p>
                   </div>
                  
                   <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Experience level</p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">{user?.skillevel || "Not specified"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">GitHub</p>
                      {user?.github_link ? (
                        <a
                          href={user.github_link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                        >
                          <FaGithub className="h-4 w-4" />
                          Open profile
                        </a>
                      ) : (
                       <p className="mt-2 text-sm text-slate-500">No GitHub link added</p>
                      )}
                    </div>
                  </div>
                                 
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-2">
                      <FaCode className="h-4 w-4 text-purple-600" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Skills</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.skills.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <span key={`${skill}-${index}`} className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No skills listed yet.</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="flex items-center gap-2">
                      <FaCode className="h-4 w-4 text-purple-600" />
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Domains</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                     {user.domains.length > 0 ? (
                        user.domains.map((domain, index) => (
                          <span key={`${domain}-${index}`} className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm">
                            {domain}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">No domains listed yet.</span>
                      )}
                    </div>
                  </div>
                </div>
               </div>
           </div>
          </div>
        )}
     </div>
   )
}