import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { NotebookPen } from "lucide-react";
import { MagnifyingGlassIcon,FolderOpenIcon ,PlusIcon ,ChatBubbleOvalLeftIcon,ChevronDoubleDownIcon,ChevronDoubleUpIcon} from "@heroicons/react/24/outline";
import githublogo from "../assets/logos/github.png"
import arxivlogo from "../assets/logos/arxiv.png"
import{FaTrash,FaPencilAlt} from "react-icons/fa"
import { useNavigate } from "react-router-dom";
export default function Research() {
  const navigate=useNavigate();
  const { workId, projectId } = useParams();
  const [projectName, setprojectName] = useState(null);
  const [msg, setmsg] = useState("");
  const [error, seterror] = useState("");
  const[results,setresults]=useState([]);
  const[formdata,setformdata]=useState({
    topic:"",
  });
  const[githubnoteslists,setgithubnoteslist]=useState({});
  const[reponotes,setreponotes]=useState({});
  const[arrowup,setarrowup]=useState(false);
  const[arrowdown,setarrowdown]=useState(true);
  const[foldersection,setfoldersection]=useState(false);
  const[repoerror,setrepoerror]=useState("");
  const[githubresults,setgithubresults]=useState([]);
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
  const sources=[
    {
      name:"github",
      logo:githublogo,
    },
    {
      name:"arxiv",
      logo:arxivlogo,
    },
  ];
  const[selectedResources,setselectedResources]=useState({
    name:"github",
    logo:githublogo,
  });
  const[showResources,setshowResources]=useState(false);
  const handlegitinfo=(e)=>{
    setgetinfo((prev)=>({...prev,[e.target.name]:e.target.value}));
  }
  
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
  const researchsubmit=(e)=>{
    setformdata((prev)=>({...prev,[e.target.name]:e.target.value}))
  }
  
  const handleSearch=async(e)=>{
    e.preventDefault();
    if(selectedResources.name==="arxiv")
    {
      await searcharxiv();
    }
    if(selectedResources.name==="github")
    {
      await searchgithub();
    }
  }
  const searcharxiv=async()=>{
    setmsg("");
    seterror("");
    try{
      const response=await axios.get("http://localhost:8000/api/research/search-topic",
        {
          params:{topic:formdata.topic},
          withCredentials: true
        }
      );
      console.log(response);
      setresults(response.data.results);
      setmsg(response.data.msg);
    }catch(error)
    {
      if(error.response)
      {
        seterror(error.response.data.msg || "Cannot fetch Research Papers");
      }
      else
      {
        seterror("Internal server error");
      }
    }
  }
  const searchgithub=async()=>{
      setmsg("");
      seterror("");
      try{
        const response=await axios.get("http://localhost:8000/api/research/github-search",
          {
            params:{topic:formdata.topic},
            withCredentials:true,
          },
        );
        console.log(response);
        setgithubresults(response.data.repositories);

      }catch(error)
      {
              if(error.response)
              {
                seterror(error.response?.data?.msg || "Cannot fetch github repositories");
              }
              else
              {
                seterror("Internal server error");
              }
      }
  }
  const saveGithubRepo=async(repo)=>{
    try{
         const response=await axios.post(`http://localhost:8000/api/research/save-github-repo/${projectId}/${workId}`,
          {
            name:repo.name,
            html_url:repo.html_url,
          },{
            withCredentials:true,
          }
      );
      alert("Saved successfully");
    }catch(error)
    {
       if(error.response)
       {
        alert("Cannot be saved")
        setrepoerror(error.response?.data?.msg || "Cannot save repository");
       }
       else
       {
        setrepoerror("Internal server error");
       }
    }
  }
  const fetchsavedgithubrepos=async(e)=>{
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
                          {arrowdown && <ChevronDoubleDownIcon className="w-8 h-8"/>}  
                          {!arrowdown && <ChevronDoubleUpIcon className="w-8 h-8"/>}
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
                                   <button className="mx-2" onClick={()=>deletesavedRepo(repo._id)}>
                                    <FaTrash className="h-5 w-5 text-red-500 hover:text-red-600"/>
                                   </button>
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
      {researchhub && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40"
            onClick={()=>{setresearchhub(false);setresults([]);setgithubresults([])}}>
            </div>
             <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-y-auto"
             onClick={(e)=>e.stopPropagation()}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-3">
                  <h1 className="p-5 font-bold text-2xl">Research Hub</h1>
                  <div className="flex flex-1 justify-end items-center mx-7">
                    <button className="text-lg font-bold text-red-500 hover:text-red-600"  onClick={()=>{setresearchhub(false);setresults([]);setgithubresults([])}}>X</button>
                  </div>
                </div>
                <div className="flex p-4 justify-center items-center">
                  <form onSubmit={handleSearch} className="flex flex-col gap-3">
                   <div className="flex flex-row gap-3">
                     <div className="relative w-full flex flex-row gap-3">
                       <input type="text"
                       name="topic"
                       placeholder="Search research papers"
                       onChange={researchsubmit}
                        className="w-full border border-blue-200 border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                       <button className="hover:bg-gray-100 rounded-2xl p-2" type="button" onClick={()=>setshowResources(!showResources)}>
                       <img src={selectedResources.logo} alt={selectedResources.name} className="w-8 h-8 rounded-full"/>
                       </button>
                       {showResources && (
                      <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border z-50">
                         {sources.map((source)=>(
                          <div key={source.name}
                          onClick={()=>{setselectedResources(source);setshowResources(false)}}
                          className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer">
                          <img src={source.logo} alt={source.name} 
                          className="w-8 h-8 object-contain"/>

                          <span>{source.name}</span>
                          </div>
                         ))}
                      </div>
                     )}
                     </div>
                     
                   </div>
                   <button type="submit" className="text-white  bg-blue-500 font-bold p-3 rounded-xl hover:bg-blue-600 ">Search</button>
                  </form>
                </div>
                {results.length> 0 && (
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                     {results.map((result,index)=>(
                        <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                         <h2 className="text-md font-semibold text-gray-800">
                            Title : {result.title}
                         </h2>
                         <h3 className="text-sm font-semibold text-gray-600">{result.summary}</h3>
                         <a href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 mt-4 inline-flex items-center gap-2 font-semibold ">
                            Open Paper
                        </a>
                        </div>
                     ))}
                  </div>
                )}
                {githubresults.length>0 && (
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                     {githubresults.map((result,index)=>(
                      <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                           <h2 className="text-md font-semibold text-gray-800">
                            Repository name :{result.name}
                           </h2>
                            <h3 className="text-sm font-semibold text-gray-600">{result.description}</h3>
                            <a href={result.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 mt-4 inline-flex items-center gap-2 font-semibold ">
                            Open Repository
                        </a>
                       <button onClick={()=>saveGithubRepo(result)} className="mx-6 text-md text-red-500 hover:text-red-600">Save</button>
                      </div>
                     ))}
                  </div>
                )}
               
              </div>
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
         
        </div>
         <div className="flex bg-gray-100 flex-col gap-3 w-full h-full rounded-2xl">
          <div className="flex flex-col gap-2 p-3">
            <div className="flex flex-row gap-3">
              <h1 className="text-lg p-3 font-mono">GITHUB repositories </h1>
              <div className="flex flex-1 justify-end">
                <button onClick={()=>setrepooption(true)} className="text-sm font-bold text-red-500   rounded-2xl p-2 hover:text-red-600">
                  <PlusIcon className="text-red h-6 w-6"/>
                </button>
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
                 
              </form>
              <button onClick={()=>setTaskedit(!Taskedit)} className="bg-slate-100 rounded-3xl hover:bg-gray-200"><FaPencilAlt className="w-4 h-4 mx-4 "/></button>
            </div>
            {ResearchTasks.length==0  ?(
              <h1 className="text text-md text-red-400 font-sans">No task Created</h1>
            ):(
              <div className="grid grid-cols-1 gap-2">
                {!Taskedit && ResearchTasks.map((task,index)=>(
                  <div key={task._id} className="bg-white p-4  flex items-start justify-start rounded-2xl">
                    <div className="flex flex-col">
                      <h1 className="text-red-500 font-mono">Task {index+1}</h1>
                      <p className="text-md">{task.description}</p>
                    </div>
                      
                  </div>
                ))}
                {Taskedit && ResearchTasks.map((task,index)=>(
                  <div key={task._id} className="bg-white p-4  flex items-start justify-start rounded-2xl">
                    <div className="flex flex-col">
                      <h1 className="text-red-500 font-mono">Task {index+1}</h1>
                      <p className="text-md">{task.description}</p>
                    </div>
                      <div className="flex flex-1 justify-end">
                        <button onClick={()=>handledeletetask(task._id)}  className="text-2xl text-red-500">
                         <FaTrash className="w-4 h-4"/>
                        </button>
                      </div>
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