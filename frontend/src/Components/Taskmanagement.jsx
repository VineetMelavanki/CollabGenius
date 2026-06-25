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
  },[workId]);

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
        <div className="flex bg-gray-100 flex-col gap-3 w-full h-full rounded-2xl">
          <div className="flex flex-col gap-3 p-5">
            <div className="flex flex-row gap-2">
              <h1 className="mx-1 text-lg font-mono my-2">Task management</h1>
            {Leader && 
            <form onSubmit={handletaskSubmit} className="flex flex-row gap-2">
                <input type="text"
                placeholder="Create task"
                name="description"
                value={ResearchTaskformdata.description}
                onChange={(e)=>{
                  setResearchTaskformdata((prev)=>({...prev,[e.target.name]:e.target.value}));
                }}
                 className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none mx-2 focus:ring-2 focus:ring-purple-500" />
                 <button type="submit" className="text-lg font-bold bg-green-500 text-white p-2 rounded-xl ">Create</button>
                 
              </form> }  
            
            </div>
            {ResearchTasks.length==0  ?(
              <h1 className="text text-md text-red-400 font-sans">No task Created</h1>
            ):(
              <div className="grid grid-cols-1 gap-2">
                
                {!Taskedit && ResearchTasks.map((task,index)=>(
                
                  <div key={task._id}  className="bg-white p-4  flex items-start justify-start rounded-2xl">
                    <div className="flex flex-col w-full">
                      <div className="flex flex-row gap-3">
                        <h1 className="text-red-500 font-mono text-2xl mb-2">Task {index+1}</h1>
                        {Leader && !Taskedit && <FaPencilAlt onClick={()=>setTaskedit(!Taskedit)} className="w-4 h-4 mx-3 my-2 "/>  }  
              {Leader && Taskedit && <button onClick={()=>setTaskedit(!Taskedit)} className="text-lg text-red-500 p-2 mx-2 font-bold ">X</button>}
                        <div className="flex flex-1 justify-end">
                        {Leader && 
                          <div className="flex flex-row gap-2 mx-2">

                          {openmembers===task._id ?(
                           <img onClick={()=>{setmemberslist(true);getallmembers();setopenmembers(null)}} src={task?.assignedphoto?.url||nulllogo} className="w-10 h-10 mx-2 rounded-full"/>
                          ):(
                            <img onClick={()=>{setmemberslist(true);getallmembers();setopenmembers(task._id)}} src={task?.assignedphoto?.url||nulllogo} className="w-10 h-10 mx-2 rounded-full"/>
                          )}  
                          </div>
                          }
                        {!Leader &&  <img onClick={()=>navigate(`/view-profile/${task?.assignedto?._id}`)}  src={task?.assignedphoto?.url||nulllogo} className="w-10 h-10 mx-2 rounded-full"/> }   
                        {openmembers===task._id && memberslist && 
                         <div className="relative inline-block" >
                          <div className="absolute top-full right-0 mt-2 z-50" >
                              <div className="bg-white shadow-lg rounded-2xl w-48 flex flex-col gap-1 " >
                                {allmembers.map((member)=>(
                                    <div key={member._id} className="bg-white flex flex-row gap-4 hover:bg-blue-200 p-4" onClick={()=>assigntask(task._id,member._id)} >
                                      <img src={member.photo?.url ||nulllogo}  className="w-8 h-8 rounded-full "/>
                                       <h1 className="text-md font-mono">{member.name}</h1>
                                    </div>
                                ))}
                              </div>
                          </div>
                          </div>}  
                        {opentask===task._id ?(
                          <ChevronUp className="w-5 h-5"
                          onClick={()=>setopentask(null)}/>
                        ):(
                          <ChevronDown className="w-5 h-5"
                          onClick={()=>setopentask(task._id)}/>
                        )}
                        </div>
                      </div>
                    {opentask==task._id &&
                    <div>
                      <p className="text-lg "><span className="text-purple-500">Description </span>: {task.description}</p>
                          <h1 className="text-lg text-blue-500 font-mono py-4">Related Respositories</h1>
                    </div> }  
                        
                      
                    {opentask==task._id &&
                    <div className="grid grid-cols-1 gap-2 w-full">
                        {task?.relatedrepos?.length>0 ?(
                          task.relatedrepos?.map((repo)=>(
                             <div className="flex bg-white shadow-lg p-2 rounded-lg  justify-start w-full">
                               <div className="flex flex-row gap-2 w-full p-3">
                                 <span className="font-mono text-blue-500">{repo.name}</span>
                                 <div className="flex flex-1 gap-3 justify-end">
                                    <div className="flex flex-row gap-3">
                                      <button onClick={openSavedRepo} className="text-red-500 font-bold ">Open</button>
                                      <a href={repo.repourl}
                                      target="_balnk"
                                      rel="noopener noreferrer"
                                      className="text-green-500 font-bold mx-2">View
                                      </a>
                                    </div>
                                 </div>
                               </div>
                             </div>
                          ))
                        ):(
                         <p className="text-gray-500">No related repositories</p>
                        )}

                      </div> }  
                    </div>
                  </div>)
)}               
                {Taskedit && ResearchTasks.map((task,index)=>(
                  <div key={task._id} className="bg-white p-4  flex items-start justify-start rounded-2xl">
                    <div className="flex flex-col w-full ">
                      <div className="flex flex-row gap-3 w-full">
                        <h1 className="text-red-500 font-mono">Task {index+1}</h1>
                        <div className="flex flex-1 justify-end">
                          
                        <button onClick={()=>handledeletetask(task._id)}  className="text-2xl text-red-500">
                         <FaTrash className="w-4 h-4"/>
                        </button>
                      </div>          
                      </div>
                      <p className="text-md">{task.description}</p>
                      <div className="flex flex-row gap-3">
                        <h1 className="text-lg text-blue-500 font-mono py-4">Related Respositories</h1>
                        <button onClick={()=>{setchoosesavedrepo(true);fetchsavedgithubrepos()}} className="text-2xl text-red-500 my-3 mx-2 font-bold rounded-3xl px-2">+</button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 w-full">
                        {task?.relatedrepos?.length>0 ?(
                          task.relatedrepos?.map((repo)=>(
                             <div className="flex bg-white shadow-lg p-2 rounded-lg  justify-start w-full">
                               <div className="flex flex-row gap-2 w-full p-3">
                                 <span className="font-mono text-blue-500">{repo.name}</span>
                                 <div className="flex flex-1 gap-3 justify-end">
                                    <div className="flex flex-row gap-2">
                                      
                                      <button className="text-3xl font-bold text-red-500">-</button>
                                    </div>
                                 </div>
                               </div>
                             </div>
                          ))
                        ):(
                         <p className="text-gray-500">No related repositories</p>
                        )}

                      </div>
                      
                    </div>
                   {choosesavedrepo &&  <div className="fixed inset-0 z-50 p-4 flex items-center justify-center" >
                      <div className="absolute inset-0 bg-black/20" onClick={()=>setchoosesavedrepo(false)}/>
                      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex flex-row gap-3 w-full">
                          <h1 className="text-xl font-bold text-black my-2">Choose repositories</h1>
                          <div className="flex flex-1 justify-end">
                             <button className="mx-4 font-bold text-red-500" onClick={()=>setchoosesavedrepo(false)} >X</button>
                          </div>
                        </div>
                        {SavedRepos.length==0 ? (
                           <h1 className="text-lg font-sans text-red-500">No saved Repositories</h1>
                        ):(
                          <div className="grid grid-cols-1 gap-2">
                           {SavedRepos.map((repo,index)=>(
                            <div key={repo._id} className="flex bg-slate-100 p-2">
                                <div className="flex flex-row gap-3 w-full">
                                  <h1 className="text-blue-500 font-mono text-lg"><span className="text-red-500 font-mono mx-2">{index+1}</span>{repo.name}</h1>
                                  <div className="flex flex-1 justify-end">
                                    <button onClick={()=>AddRelatedRepos(task._id,repo._id)} className="text-md text-white p-2 rounded-xl font-bold bg-red-500 ">Add</button>
                                  </div>
                                </div>
                            </div>
                           ))}
                          </div>
                        )}
                      </div>
                       
                    </div>}     
                  </div>
                ))}
              </div>
            )}
          </div>
         </div>
    )
}