import React from "react";
import axios from "axios";
import { useState } from "react";
import { NotebookPen ,UserRound ,ChevronUp,ChevronDown} from "lucide-react";
import { FolderOpenIcon } from "lucide-react";
import { FaTrash } from "react-icons/fa";
export default function SavedGithubRepos({projectId,workId,onClose,Leader}){
    const[githubnoteslists,setgithubnoteslist]=useState({});
    
    const[arrowdown,setarrowdown]=useState(true);
     const[reponotes,setreponotes]=useState({});
      const[SavedRepos,setSaveRepos]=useState([]);
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
  return(
     <div className="fixed inset-0 z-50 flex justify-end">
                 <div  className="absolute inset-0 bg-black/40"
                 onClick={()=>{onClose();setarrowdown(true)}}/>
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
  )
}