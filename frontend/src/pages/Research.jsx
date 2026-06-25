import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { NotebookPen ,UserRound ,ChevronUp,ChevronDown} from "lucide-react";
import { MagnifyingGlassIcon,FolderOpenIcon ,PlusIcon ,ChatBubbleOvalLeftIcon,ChevronDoubleDownIcon,ChevronDoubleUpIcon} from "@heroicons/react/24/outline";
import ResearchSearchBar from "../Components/ResearchSearchBar";
import nulllogo from  "../assets/logos/null.png"
import{FaTrash,FaPencilAlt,FaUser} from "react-icons/fa"
import { useNavigate } from "react-router-dom";
export default function Research() {
  const navigate=useNavigate();
  const { workId, projectId } = useParams();
  const [projectName, setprojectName] = useState(null);
  const [msg, setmsg] = useState("");
  const [error, seterror] = useState("");

  const[memberslist,setmemberslist]=useState(null);
  const[allmembers,setallmembers]=useState([]);
  const[Leader,setLeader]=useState(null);
  const[choosesavedrepo,setchoosesavedrepo]=useState(false);
  const[githubnoteslists,setgithubnoteslist]=useState({});
  const[relatedrepolists,setrelatedrepolist]=useState([]);
  const[reponotes,setreponotes]=useState({});
  const[arrowup,setarrowup]=useState(false);
  const[taskarrowdown,settaskarrowdown]=useState(true);
  const[opentask,setopentask]=useState(null);
  const[openmembers,setopenmembers]=useState(null);
  const[arrowdown,setarrowdown]=useState(true);
  const[foldersection,setfoldersection]=useState(false);


  const[repolist,setrepolist]=useState([]);
  const[gitinfo,setgetinfo]=useState({
    name:"",
    description:"",
    private:false,
  });
  
  const[Taskedit,setTaskedit]=useState(false);
  const[ResearchTaskformdata,setResearchTaskformdata]=useState({
    description:"",
  })
  const[ResearchTasks,setResearchTasks]=useState([]);
  const[isSaved,setisSaved]=useState(false);
  const[SavedRepos,setSaveRepos]=useState([]);

  const handlegitinfo=(e)=>{
    setgetinfo((prev)=>({...prev,[e.target.name]:e.target.value}));
  }
  useEffect(()=>{
    const verifyowner=async()=>{
         try{
            const response=await axios.get(`http://localhost:8000/api/Project/verify-Leader/${projectId}`,{
              withCredentials:true,
            });
            setLeader(response.data.isLeader);
         }catch(error)
         {
          if(error.response)
          {
            alert(error.response?.data?.msg || "Cannot verify Leader");
          }
          else
          {
            alert("Internal server error");
          }
         }
    } 
    verifyowner();
  },[workId,projectId])
  useEffect(()=>{
     const getallRepo=async()=>{
        seterror("");
        setmsg("");
        try{
          const response=await axios.get(`http://localhost:8000/api/User/github/get-repo/${projectId}/${workId}`,
            {
              withCredentials:true,
            }
          );
          setrepolist(response.data.allrepo);
         
        }catch(error)
        {
           if(error.response)
           {
            seterror(error.response?.data?.msg || "Cannot fetch repositories");
           }
           else
           {
            seterror("Internal server error");
           }
        }
     }
     getallRepo();
  },[workId,projectId])
  const handlereposubmit=async(e)=>{
    e.preventDefault();
    seterror("");
    setmsg("");
    try{
        const response=await axios.post(`http://localhost:8000/api/User/github/create-repo/${projectId}/${workId}`,gitinfo,
          {
            withCredentials:true,
          }
        );
       setrepolist((prev)=>[...prev,response.data.repo]);
       setmsg(response.data?.msg || "Github repository created successfully");
    }catch(error)
    {
        if(error.response)
        {
          seterror(error.response?.data?.msg || "Cannot create github Repo");
        }
    }
  }
  const[repooption,setrepooption]=useState(false);
  const[researchhub,setresearchhub]=useState(false);
  useEffect(() => {
    
    const getproject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/Work/get-WORK/${workId}`,
          {
            withCredentials: true
          }
        );
        setprojectName(response.data.Project);
      } catch (error) {
        if (error.response) {
          seterror(error.response?.data?.msg || "Cannot get project details");
        } else {
          seterror("Internal server error");
        }
      }
    };
    getproject();
  }, [workId]);
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
  const deletesavedRepo=async(repoId)=>{
    try{
      const response=await axios.delete(`http://localhost:8000/api/research/delete-github-repo/${projectId}/${workId}/${repoId}`,{
        withCredentials:true,
      });
      setSaveRepos((prev)=>prev.filter((r)=>(r._id || r).toString()!==repoId.toString()));
      alert(response?.data?.msg || "Repository deleted");
    }catch(error)
    {
      if(error?.response)
      {
        alert("Cannot delete repo");
      }
      else
      {
        alert("Internal server error");
      }
    }
  }
  
  const handleNotesAdditon=async(repoId)=>{
  
    try{
      const description=reponotes[repoId];
      const response=await axios.post(`http://localhost:8000/api/Notes/create-notes/${repoId}`,{description},
        {
          withCredentials:true,
        }
      );

      setreponotes(prev=>({
   ...prev,
   [repoId]:""
}));
    }catch(error)
    {
       if(error.response)
       {
        alert(error.response?.data?.msg || "Cannot add notes");
       }
       else
       {
        alert("Internal server error");
       }
    }
  }
  const fetchallnotes=async(repoId)=>{
    try{
      const response=await axios.get(`http://localhost:8000/api/Notes/get-all-notes/${repoId}`,{
        withCredentials:true,
      });
      setgithubnoteslist((prev)=>({...prev,[repoId]:response.data.Notes}));
     
    }catch(error)
    {
        if(error.response)
        {
          alert(error.response?.data?.msg || "Cannot fetch notes");
        }
        else
        {
          alert("Internal server error");
        }
    }
  }
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
  const handledeletetask=async(TaskId)=>{
   ;
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
  return (
    <div className="flex w-full  rounded-2xl">
       {repooption && 
           <div onClick={()=>setrepooption(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
               onClick={(e) => e.stopPropagation()}>
                 
                <div className="flex flex-col gap-3 justify-center items-center">
                  <div className="flex items-center justify-center font-mono ">
                      <h1 className="text-lg">Create your own github repo</h1>
                  </div>
                  {msg && <p className=" text-green-600 font-mono text-md">{msg}</p>}
            {error && <p className=" text-red-600 font-mono text-md">{error}</p>}
                  <form onSubmit={handlereposubmit} className="flex flex-col gap-3">
                    <input type="text"
                    name="name"
                    value={gitinfo.name}
                    placeholder="Enter repository name"
                    onChange={handlegitinfo}
                    className="text-md font-bold  border-purple-300 border-2 hover:border-purple-600 p-3 rounded-2xl"
                    />
                    <input type="text"
                    name="description"
                    value={gitinfo.description}
                    placeholder="Enter description"
                    onChange={handlegitinfo}
                    className="text-md font-bold  border-purple-300 border-2 hover:border-purple-600 p-3 rounded-2xl"/>
                    <button type="button" onClick={()=>setgetinfo((prev)=>({...prev,private:!prev.private}))}
                      className={`text-white font-bold rounded-2xl p-3 transition-all duration-300 ${gitinfo.private ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
                        {gitinfo.private ? "Change to public": "Change to private"}
                      </button>
                    <button disabled={!gitinfo.name.trim() || !gitinfo.description.trim()} type="submit" className="font-bold text-white bg-red-500 hover:bg-red-600 text-xl rounded-xl p-3">Create</button>
                  </form>
                </div>
              </div>
            </div>}
            {foldersection && !researchhub &&  (
              <div className="fixed inset-0 z-50 flex justify-end">
                 <div  className="absolute inset-0 bg-black/40"
                 onClick={()=>{setfoldersection(false);setarrowdown(true)}}/>
                  <div className="relative bg-white w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-y-auto">
                      <div className="flex flex-col  gap-3 justify-start items-start p-6">
                        <div className="flex flex-row gap-3">
                          <div className="border border-2 flex flex-row gap-2 p-2">
                            <FolderOpenIcon className="w-8 h-8 text-yellow-500"/>
                            <h1 className="text-lg font-mono">Github Saves</h1>
                            
                          </div>
                          <button onClick={()=>{setarrowdown(!arrowdown);fetchsavedgithubrepos()}} className="border border-2 hover:bg-gray-200">
                          {arrowdown && <ChevronDown className="w-8 h-8"/>}  
                          {!arrowdown && <ChevronUp className="w-8 h-8"/>}
                          </button>
                        </div>
                        
                      </div>
                     {!arrowdown && SavedRepos.length>0 && (
                          <div className="grid grid-cols-1 gap-3 ">
                            {SavedRepos.map((repo)=>(
                              <div key={repo._id} className="flex flex-col  bg-white p-6 rounded-xl shadow-lg ">
                                <div className="flex flex-row gap-3">
                                <h1 className="text-blue-500 font-bold text-2xl">{repo.name}</h1>
                                 
                                 <div className="flex flex-1 justify-end">
                                  <h1 className="text-black mx-12 font-mono py-2">Saved by : <span className="hover:underline text-green-500" onClick={() => navigate(`/view-profile/${repo.savedby?._id}`)}>{repo.savedby?.name}</span></h1>
                                  {Leader && <button className="mx-2" onClick={()=>deletesavedRepo(repo._id)}>
                                    <FaTrash className="h-5 w-5 text-red-500 hover:text-red-600"/>
                                   </button>} 
                                 </div>
                                </div>
                                <div className="flex flex-col gap-3 border p-4 w-full mt-2">
                                  <div className="flex flex-row gap-3 justify-start items-center">
                                    <h1 className="font-mono text-lg ">Notes</h1>
                                    <form onSubmit={(e)=>{e.preventDefault();handleNotesAdditon(repo._id);}} className="flex flex-row gap-3">
                                      <input type="text"
                                      name="description"
                                      value={reponotes[repo._id]|| ""}
                                      onChange={(e)=>{
                                        setreponotes(prev=>({
                                          ...prev,
                                          [repo._id]:e.target.value,
                                        }))
                                      }}
                                      placeholder="Enter your notes"
                                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                      <button type="submit" className="text-white bg-red-500 font-bold px-4 rounded-2xl hover:bg-red-600">Add</button>
                                    </form>
                                    <button onClick={()=>fetchallnotes(repo._id)}  className="text-white bg-yellow-500 font-mono text-lg p-3 rounded-2xl">
                                      <NotebookPen className="w-8 h-8"/>
                                    </button>
                                  </div>
                                {!(githubnoteslists[repo._id]?.length) ?(
                                  <div className="text-slate-100 font-mono text-lg">No notes created</div>
                                ):(
                                  <div className="flex flex-col gap-2">
                                    {githubnoteslists[repo._id]?.map((note)=>(
                                      <div key={note._id} className="bg-white items-start justify-start">
                                          <div className="text-md font-semibold"><span className="text-purple-500">{note.author?.name} : </span>{note.description}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                </div>
                                <a href={repo.repourl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 mt-4 inline-flex items-center gap-2 font-semibold ">
                            Open Repository
                        </a>
                              </div>
                            ))}
                          </div>
                        )}
                  </div>
              </div>
            )}
     
      <div className="flex flex-col gap-3">
        <div className="flex bg-gray-100 flex-col  gap-3 rounded-2xl">
           <div className="flex flex-row items-start  gap-4 p-2">
            <h1 className="text-2xl sm:text-md md:text-2xl lg:text-2xl text-white bg-blue-400 font-bold p-2 rounded-xl">Research Panel</h1>
        
           <div className="flex flex-row">
              <h1 className="text-2xl sm:text-md md:text-2xl lg:text-2xl text-black   font-bold p-2 rounded-xl">Project Name:</h1>
              <h1 className="text-2xl sm:text-md md:text-2xl lg:text-2xl text-green-500 font-bold p-2">{projectName?.name}</h1>
              
           </div>
            
           </div>
           
        </div>
        <div className="flex bg-gray-100 flex-col gap-3 rounded-2xl">
         <div className="flex flex-row ">
           <h1 className="flex items-start justify-start p-4 font-bold text-2xl">Workspace</h1>
           <div className="flex items-center justify-center">
              <button onClick={()=>setresearchhub(!researchhub)} className="text-lg font-bold mx-5 text-white border bg-black/80 p-3 rounded-2xl  hover:bg-black">
                    <MagnifyingGlassIcon className="h-5 w-5 text-white" />
              </button>
              <button>
                <FolderOpenIcon onClick={()=>setfoldersection(true)} className="h-7 w-7 text-yellow-500 "/>
              </button>
              
          
            </div>
         </div>
         {researchhub && (
          <ResearchSearchBar
          projectId={projectId}
          workId={workId}
          onClose={()=>setresearchhub(false)}/>
         )}
        </div>
         <div className="flex bg-gray-100 flex-col gap-3 w-full h-full rounded-2xl">
          <div className="flex flex-col gap-2 p-3">
            <div className="flex flex-row gap-3">
              <h1 className="text-lg p-3 font-mono">GITHUB repositories </h1>
              <div className="flex flex-1 justify-end">
              {Leader && 
                <button onClick={()=>setrepooption(true)} className="text-sm font-bold text-red-500   rounded-2xl p-2 hover:text-red-600">
                  <PlusIcon className="text-red h-6 w-6"/>
                </button>}  
              </div>
            </div>
            {repolist.length===0 ?(
            <div className="text-red-200 font-mono text-lg">No respositories created</div>
          ) :(
            <div className="grid grid-col-1 gap-3">
              {repolist.map((repo)=>(
                <div key={repo._id}  className="flex flex-col  bg-white p-4 rounded-xl shadow hover:-translate-y-1 transition-all duration-200">
                      <div className="flex flex-row ">
                        <h1 className="text-blue-500 font-bold">{repo.name}</h1>
                         
                        <div className="flex flex-1 justify-end mx-4">
                          <a href={repo.repourl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 mt-4 inline-flex items-center gap-2 font-semibold " >
                            View
                          </a>
                        </div>
                      </div>
                      <p className="text-md font-thin">{repo.description}</p>
                </div>
              ))}
            </div>
          )
          }
          </div>
          
         </div>
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
                                      <button onClick={()=>{setfoldersection(true);setarrowdown(false)}} className="text-red-500 font-bold ">Open</button>
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
      </div>
    </div>
  );
}