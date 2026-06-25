import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronDown,ChevronUp } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import nulllogo from "../assets/logos/null.png"
import { FaPencilAlt } from "react-icons/fa";
export default function TaskManagement({projectId,workId,Leader,openSavedRepo}){
    const navigate=useNavigate();
    const[allmembers,setallmembers]=useState([]);
    const[choosesavedrepo,setchoosesavedrepo]=useState(false);
    const[SavedRepos,setSaveRepos]=useState([]);
    const[Taskedit,setTaskedit]=useState(false);
    const[ResearchTaskformdata,setResearchTaskformdata]=useState({
        description:"",
      })
        const[memberslist,setmemberslist]=useState(null);
    const[ResearchTasks,setResearchTasks]=useState([]);
    const[opentask,setopentask]=useState(null);
    const[openmembers,setopenmembers]=useState(null);
    
    useEffect(()=>{
    const fetchTasks=async()=>{
       try{
          const response=await axios.get(`http://localhost:8000/api/ResearchTask/get-all-tasks/${projectId}/${workId}`,{
            withCredentials:true,
          });
          setResearchTasks(response.data.Tasks ||[]);
       }catch(error)
       {
           if(error.response)
           {
            alert("Cannot fetch tasks");
           }
           else
           {
            alert("Internal server error");
           }
       }
    }
    fetchTasks();
  },[projectId, workId]);

    const handletaskSubmit=async(e)=>{
    e.preventDefault();
    try{
       const response=await axios.post(`http://localhost:8000/api/ResearchTask/create-task/${projectId}/${workId}`,ResearchTaskformdata,
        {
          withCredentials:true,
        }
       );
       alert("Task added successfully");
       setResearchTasks((prev)=>[...prev,response.data.Task]);
       setResearchTaskformdata({description:""});
    }catch(error)
    {
         if(error.response)
         {
          alert(error.response?.data?.msg ||"Cannot create task");
         }else
         {
          alert("Internal server error");
         }
    }
  }

  const handledeletetask=async(TaskId)=>{
   
    try{
        const response=await axios.delete(`http://localhost:8000/api/ResearchTask/delete-task/${projectId}/${workId}/${TaskId}`,{
          withCredentials:true,
        });
         setResearchTasks((prev)=>prev.filter((r)=>(r._id || r).toString()!==TaskId.toString()));
         alert(response.data?.msg || "Task deleted successfully");
    }catch(error)
    {
         if(error.response)
         {
          alert("Cannot delete task");
         }
         else
         {
          alert("Internal server error");
         }
    }
  }

  const AddRelatedRepos=async(TaskId,repoId)=>{
     try{
      console.log("Task Id : ",TaskId);
      console.log("Repo Id : ",repoId);
      const response=await axios.post(`http://localhost:8000/api/ResearchTask/add-related-repos/${projectId}/${workId}/${TaskId}/${repoId}`,{},{
        withCredentials:true,
      });
      alert(response?.data?.msg || "Related Repositories added");
     }catch(error)
     {
      if(error.response)
      {
        alert(error.response?.data?.msg || "Cannot add Repositories");
      }else
      {
        alert("Internal server error");
      }
     }
  }

  const getallmembers=async()=>{
    try{
        const response=await axios.get(`http://localhost:8000/api/Project/all-members/${projectId}`,{
          withCredentials:true,
        });
        setallmembers(response.data.members);
     
    }catch(error)
    {
        if(error.response)
        {
          alert("Unable to fetch members");
        }
        else
        {
          alert("Internal server error");
        }
    }
  }
  
  const assigntask=async(TaskId,memberId)=>{
    try{
      const response=await axios.post(`http://localhost:8000/api/ResearchTask/assign-task/${projectId}/${workId}/${TaskId}/${memberId}`,{},
        {
          withCredentials:true
        }
      );
      alert(response.data?.msg || "Task assigned successfully");
    }catch(error)
    {
         if(error.response)
         {
          alert(error.response?.data?.msg || "Failed to assign task");
         }
         else
         {
          alert("Internal server error");
         }
    }
  }

  const fetchsavedgithubrepos=async()=>{
      try{
       const response=await axios.get(`http://localhost:8000/api/research/saved-github-repos/${projectId}/${workId}`,{
        withCredentials:true,
       });
       setSaveRepos(response.data.Repos);
      }catch(error)
      {
          if(error.response)
          {
            alert(error.response?.data?.msg || "Repos cannot be fetched");
          }
          else
          {
            alert("Internal server error");
          }
      }
    }

    return(
        <div className="flex  w-full flex-col gap-4 rounded-[24px] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(248,250,252,0.9))] p-4 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.38)]">
          <div className="flex flex-col gap-4 rounded-[20px] border border-slate-200/70 bg-white/80 p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-600">Project workflow</p>
                <h1 className="text-xl font-semibold text-slate-800">Task management</h1>
              </div>
              {Leader && (
                <form onSubmit={handletaskSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    placeholder="Create a new task"
                    name="description"
                    value={ResearchTaskformdata.description}
                    onChange={(e) => {
                      setResearchTaskformdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
                    }}
                    className="w-full min-w-[220px] rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  />
                  <button type="submit" className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105">
                    Create task
                  </button>
                </form>
              )}
            </div>

            {ResearchTasks.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center">
                <p className="text-sm font-medium text-slate-500">No tasks created yet.</p>
                <p className="mt-1 text-sm text-slate-400">Start by creating your first task for this work item.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                
                { ResearchTasks.map((task, index) => (
                    <div key={task._id} className="rounded-[20px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition duration-200 hover:shadow-md">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                              Task {index + 1}
                            </span>
                            {Leader && !Taskedit && (
                              <button
                                onClick={() =>{setTaskedit(task._id);setopentask(null)}}
                                
                                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-purple-600"
                                aria-label="Edit tasks"
                              >
                                <FaPencilAlt className="h-4 w-4" />
                              </button>
                            )}
                            {Leader && Taskedit===task._id && (
                              <button onClick={() => setTaskedit(!Taskedit)} className="rounded-full px-3 py-1 text-sm font-semibold text-red-500 transition hover:bg-red-50">
                                Exit edit
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2" >
                            {Leader && (
                              <div className="flex items-center gap-2">
                                <img
                                  onClick={() => {
                                    setmemberslist(true);
                                    getallmembers();
                                    openmembers===null ?setopenmembers(task._id) : setopenmembers(null);
                                  }}
                                  src={task?.assignedphoto?.url || nulllogo}
                                  className="h-10 w-10 cursor-pointer rounded-full border border-slate-200 object-cover"
                                  alt="Assigned member"
                                />
                              </div>
                            )}
                            {!Leader && (
                              <img
                                onClick={() => navigate(`/view-profile/${task?.assignedto?._id}`)}
                                src={task?.assignedphoto?.url || nulllogo}
                                className="h-10 w-10 cursor-pointer rounded-full border border-slate-200 object-cover"
                                alt="Assigned member"
                              />
                            )}
                            {openmembers === task._id && memberslist && (
                              <div className="relative inline-block">
                                <div className="absolute right-0 top-full z-50 mt-2">
                                  <div className="flex w-52 flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-xl">
                                    {allmembers.map((member) => (
                                      <div
                                        key={member._id}
                                        className="flex cursor-pointer flex-row items-center gap-3 rounded-xl p-3 transition hover:bg-blue-50"
                                        onClick={() => assigntask(task._id, member._id)}
                                      >
                                        <img src={member.photo?.url || nulllogo} className="h-8 w-8 rounded-full object-cover" alt={member.name} />
                                        <h1 className="text-sm font-medium text-slate-700">{member.name}</h1>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            {opentask === task._id ? (
                              <button
                                onClick={() => setopentask(null)}
                                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                              >
                                <ChevronUp className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => setopentask(task._id)}
                                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                              >
                                <ChevronDown className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {opentask === task._id && (
                          <div className="space-y-3 border-t border-slate-200 pt-4">
                            <div className="rounded-2xl bg-slate-50/80 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-600">Description</p>
                              <p className="mt-2 text-sm leading-6 text-slate-700">{task.description}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50/80 p-4">
                              <div className="flex items-center justify-between">
                                <h1 className="text-sm font-semibold text-blue-600">Related repositories</h1>
                              </div>
                              <div className="mt-3 grid grid-cols-1 gap-2">
                                {task?.relatedrepos?.length > 0 ? (
                                  task.relatedrepos?.map((repo) => (
                                    <div key={repo._id || repo.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                                      <span className="text-sm font-medium text-slate-700">{repo.name}</span>
                                      <div className="flex items-center gap-2">
                                        <button onClick={openSavedRepo} className="text-sm font-semibold text-red-500 transition hover:text-red-600">
                                          Open
                                        </button>
                                        <a
                                          href={repo.repourl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm font-semibold text-green-600 transition hover:text-green-700"
                                        >
                                          View
                                        </a>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-slate-500">No related repositories</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        {Taskedit===task._id && (
                          <div key={task._id} className="rounded-[20px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
                      <div className="flex flex-col gap-3">
                        
                        <p className="text-sm leading-6 text-slate-700">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <h1 className="text-sm font-semibold text-blue-600">Related repositories</h1>
                          <button
                            onClick={() => {
                              setchoosesavedrepo(true);
                              fetchsavedgithubrepos();
                            }}
                            className="rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
                          >
                            + Add
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {task?.relatedrepos?.length > 0 ? (
                            task.relatedrepos?.map((repo) => (
                              <div key={repo._id || repo.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                                <span className="text-sm font-medium text-slate-700">{repo.name}</span>
                                <button className="text-sm font-semibold text-red-500 transition hover:text-red-600">Remove</button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">No related repositories</p>
                          )}
                        </div>
                      </div>

                      {choosesavedrepo && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setchoosesavedrepo(false)} />
                          <div className="relative w-full max-w-md rounded-[22px] border border-slate-200 bg-white p-6 shadow-2xl">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h1 className="text-lg font-semibold text-slate-800">Choose repositories</h1>
                                <p className="mt-1 text-sm text-slate-500">Add saved GitHub repositories to this task.</p>
                              </div>
                              <button className="text-lg font-semibold text-red-500" onClick={() => setchoosesavedrepo(false)}>
                                ×
                              </button>
                            </div>
                            {SavedRepos.length === 0 ? (
                              <h1 className="mt-4 text-sm font-medium text-red-500">No saved repositories</h1>
                            ) : (
                              <div className="mt-4 grid grid-cols-1 gap-2">
                                {SavedRepos.map((repo, index) => (
                                  <div key={repo._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-red-500">{index + 1}</span>
                                      <h1 className="text-sm font-medium text-slate-700">{repo.name}</h1>
                                    </div>
                                    <button
                                      onClick={() => AddRelatedRepos(task._id, repo._id)}
                                      className="rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                                    >
                                      Add
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
    )
}